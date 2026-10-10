export interface InterviewerMindset {
  roleFocus: string;
  evaluationCriteria: string[];
  redFlags: string[];
  coachingTip: string;
}

export interface InterviewQuestion {
  id: string;
  category: string;
  question: string;
  hiddenAgenda: string;
  starWinningPoints: string[];
  commonMistakes: string[];
  sampleModelAnswerSnippet: string;
  difficulty: string;
}

export interface ReverseQuestion {
  question: string;
  whyItWorks: string;
}

export interface InterviewGenerationResult {
  interviewerMindset: InterviewerMindset;
  questions: InterviewQuestion[];
  reverseQuestionsForInterviewer: ReverseQuestion[];
}

export interface AnswerEvaluationResult {
  score: number;
  starRating: {
    situationTask: string;
    actionTaken: string;
    measurableResult: string;
  };
  strengths: string[];
  areasForImprovement: string[];
  interviewerImpression: string;
  polishedAnswer: string;
  coachVerdict: string;
}

export interface CompetencyAudit {
  acquiredSkills: string[];
  identifiedGaps: string[];
  currentLevelAssessment: string;
}

export interface RecommendedTraining {
  phaseNumber: number;
  phaseName: string;
  courseTitle: string;
  targetDomain: string;
  whyThisTraining: string;
  coreCurriculum: string[];
  handsOnMilestone: string;
  suggestedPlatformsAndCerts: string[];
  estimatedDurationWeeks: string;
}

export interface CapstoneProject {
  title: string;
  description: string;
  techStack: string[];
  interviewTalkingPoint: string;
}

export interface StrategicMilestone {
  timeframe: string;
  milestoneGoal: string;
  successMetric: string;
}

export interface CareerPathwayResult {
  competencyAudit: CompetencyAudit;
  nextStepRecommendations: RecommendedTraining[];
  capstoneProject: CapstoneProject;
  strategicMilestonesTimeline: StrategicMilestone[];
  coachSummaryMessage: string;
}
