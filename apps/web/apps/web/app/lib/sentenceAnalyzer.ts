import nlp from 'compromise';

export type SentencePattern = 'SV' | 'SVO' | 'SVC' | 'SVOO' | 'SVOC' | 'UNKNOWN';

export interface AnalysisResult {
  pattern: SentencePattern;
  isCorrect: boolean;
  feedback: string;
  components: {
    subject?: string;
    verb?: string;
    object?: string;
    indirectObject?: string;
    complement?: string;
  };
}

export interface Word {
  id: string;
  text: string;
  type: 'subject' | 'verb' | 'object' | 'place' | 'time' | 'complement';
}

export interface BoxContent {
  who?: Word | null;
  do?: Word | null;
  what?: Word | null;
  where?: Word | null;
  when?: Word | null;
}

export class SentenceAnalyzer {
  analyzeSentence(boxContents: BoxContent): AnalysisResult {
    // Construct sentence from boxes
    const sentenceParts: string[] = [];
    const components: AnalysisResult['components'] = {};

    if (boxContents.who?.text) {
      sentenceParts.push(boxContents.who.text);
      components.subject = boxContents.who.text;
    }

    if (boxContents.do?.text) {
      sentenceParts.push(boxContents.do.text);
      components.verb = boxContents.do.text;
    }

    if (boxContents.what?.text) {
      sentenceParts.push(boxContents.what.text);
      components.object = boxContents.what.text;
    }

    if (boxContents.where?.text) {
      sentenceParts.push(boxContents.where.text);
    }

    if (boxContents.when?.text) {
      sentenceParts.push(boxContents.when.text);
    }

    const sentence = sentenceParts.join(' ');
    
    if (!sentence) {
      return {
        pattern: 'UNKNOWN',
        isCorrect: false,
        feedback: 'Please add words to the boxes to form a sentence.',
        components
      };
    }

    // Analyze with compromise.js
    const doc = nlp(sentence);
    
    // Detect sentence pattern
    const pattern = this.detectPattern(doc, boxContents);
    
    // Validate grammar
    const validation = this.validateGrammar(doc, boxContents, pattern);
    
    return {
      pattern,
      isCorrect: validation.isCorrect,
      feedback: validation.feedback,
      components
    };
  }

  private detectPattern(doc: any, boxContents: BoxContent): SentencePattern {
    const hasSubject = !!boxContents.who?.text;
    const hasVerb = !!boxContents.do?.text;
    const hasObject = !!boxContents.what?.text;
    
    if (!hasSubject || !hasVerb) {
      return 'UNKNOWN';
    }

    // Check if verb is a be-verb or linking verb
    const verb = boxContents.do?.text?.toLowerCase();
    const linkingVerbs = ['is', 'am', 'are', 'was', 'were', 'be', 'been', 'being', 
                          'become', 'seem', 'appear', 'look', 'feel', 'sound', 'taste', 'smell'];
    const isLinkingVerb = verb ? linkingVerbs.includes(verb) : false;

    // Detect SVOC pattern (object + complement)
    if (hasObject && boxContents.what?.type === 'object') {
      const objectDoc = nlp(boxContents.what.text);
      // Check if there might be both object and complement
      const words = boxContents.what.text.split(' ');
      if (words.length > 2) {
        // Potentially SVOO or SVOC
        return 'SVOC'; // Simplified detection
      }
    }

    // SVC pattern (Subject + Linking Verb + Complement)
    if (isLinkingVerb && hasObject) {
      return 'SVC';
    }

    // SVO pattern (Subject + Action Verb + Object)
    if (hasObject) {
      return 'SVO';
    }

    // SV pattern (Subject + Verb only)
    return 'SV';
  }

  private validateGrammar(doc: any, boxContents: BoxContent, pattern: SentencePattern): {
    isCorrect: boolean;
    feedback: string;
  } {
    const errors: string[] = [];

    // Check if subject exists
    if (!boxContents.who?.text) {
      errors.push('A sentence needs a subject (だれが).');
    }

    // Check if verb exists
    if (!boxContents.do?.text) {
      errors.push('A sentence needs a verb (する/です).');
    }

    // Subject-verb agreement check
    if (boxContents.who?.text && boxContents.do?.text) {
      const subject = nlp(boxContents.who.text);
      const verb = nlp(boxContents.do.text);
      
      // Simple third-person singular check
      const isThirdPersonSingular = ['he', 'she', 'it'].includes(boxContents.who.text.toLowerCase()) ||
                                    (!['i', 'you', 'we', 'they'].includes(boxContents.who.text.toLowerCase()) && 
                                     !boxContents.who.text.includes(' and '));
      
      const verbText = boxContents.do.text.toLowerCase();
      const needsS = isThirdPersonSingular && !['am', 'is', 'are', 'was', 'were'].includes(verbText);
      
      if (needsS && verbText === 'study') {
        errors.push('For third-person singular, use "studies" instead of "study".');
      }
    }

    // Pattern-specific validation
    switch (pattern) {
      case 'SVO':
        if (!boxContents.what?.text) {
          errors.push('This sentence pattern needs an object (だれ・なに).');
        }
        break;
      case 'SVC':
        if (!boxContents.what?.text) {
          errors.push('This sentence pattern needs a complement after the linking verb.');
        }
        break;
    }

    if (errors.length === 0) {
      return {
        isCorrect: true,
        feedback: this.getSuccessFeedback(pattern)
      };
    }

    return {
      isCorrect: false,
      feedback: errors.join(' ')
    };
  }

  private getSuccessFeedback(pattern: SentencePattern): string {
    const patternExplanations = {
      'SV': 'Perfect! You created a simple Subject-Verb sentence.',
      'SVO': 'Excellent! You formed a Subject-Verb-Object sentence.',
      'SVC': 'Great! You made a Subject-Verb-Complement sentence with a linking verb.',
      'SVOO': 'Wonderful! You constructed a sentence with two objects.',
      'SVOC': 'Amazing! You created a complex Subject-Verb-Object-Complement sentence.',
      'UNKNOWN': 'Keep trying to form a complete sentence.'
    };

    return patternExplanations[pattern];
  }

  getSentenceFromBoxes(boxContents: BoxContent): string {
    const parts: string[] = [];
    
    if (boxContents.who?.text) parts.push(boxContents.who.text);
    if (boxContents.do?.text) parts.push(boxContents.do.text);
    if (boxContents.what?.text) parts.push(boxContents.what.text);
    if (boxContents.where?.text) parts.push(boxContents.where.text);
    if (boxContents.when?.text) parts.push(boxContents.when.text);
    
    return parts.join(' ');
  }
}

export const sentenceAnalyzer = new SentenceAnalyzer();