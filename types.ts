
export interface Goal {
  id: string;
  title: string;
  deadline: string;
  createdAt: number;
  lastReminderAt: number;
  isCompleted: boolean;
}

export interface StudyTip {
  tip: string;
  subject: string;
}
