export interface Reminder {
  scheduleId: string;
  eventTime: Date;
  localTeam: {
    teamName: string;
  };
  visitorTeam: {
    teamName: string;
  };
}
