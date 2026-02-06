
import { CodeFile, RuleViolation, SyntheticFix, DeveloperPersona } from '../types';
import * as gemini from './geminiService';

export type FixStatus = 'idle' | 'generating' | 'ready' | 'error';

export class InvariantAutoFixerService {
  private static instance: InvariantAutoFixerService | undefined;
  private activeFixes: Map<string, { fix?: SyntheticFix; status: FixStatus }>;
  private isProcessing: boolean;

  private constructor() {
    this.activeFixes = new Map();
    this.isProcessing = false;
  }

  public static getInstance(): InvariantAutoFixerService {
    if (!InvariantAutoFixerService.instance) {
      InvariantAutoFixerService.instance = new InvariantAutoFixerService();
    }
    return InvariantAutoFixerService.instance;
  }

  private getViolationKey(file: CodeFile, violation: RuleViolation): string {
    return `${file.path}:${violation.ruleId}:${violation.line}`;
  }

  public getFixStatus(file: CodeFile, violation: RuleViolation): FixStatus {
    const key = this.getViolationKey(file, violation);
    return this.activeFixes.get(key)?.status || 'idle';
  }

  public getCachedFix(file: CodeFile, violation: RuleViolation): SyntheticFix | undefined {
    const key = this.getViolationKey(file, violation);
    return this.activeFixes.get(key)?.fix;
  }

  public async provideCodeActions(
    file: CodeFile, 
    violation: RuleViolation, 
    codebase: CodeFile[], 
    persona?: DeveloperPersona,
    onUpdate?: () => void
  ): Promise<SyntheticFix | null> {
    const key = this.getViolationKey(file, violation);
    
    this.activeFixes.set(key, { status: 'generating' });
    if (onUpdate) onUpdate();

    try {
      this.isProcessing = true;
      // Fix: Argument of type 'DeveloperPersona' is not assignable to parameter of type 'string'.
      // The generateSyntheticFix service expects a string for persona. Passing the persona.type string.
      const fix = await gemini.generateSyntheticFix(file, violation, codebase, persona?.type || 'Senior');
      this.activeFixes.set(key, { fix, status: 'ready' });
      if (onUpdate) onUpdate();
      return fix;
    } catch (e) {
      this.activeFixes.set(key, { status: 'error' });
      if (onUpdate) onUpdate();
      return null;
    } finally {
      this.isProcessing = false;
    }
  }

  public clearFixes() {
    this.activeFixes.clear();
  }

  public getGlobalStatus() {
    return {
      isProcessing: this.isProcessing,
      pendingFixCount: Array.from(this.activeFixes.values()).filter(v => v.status === 'ready').length
    };
  }
}

export const autoFixerService = InvariantAutoFixerService.getInstance();
