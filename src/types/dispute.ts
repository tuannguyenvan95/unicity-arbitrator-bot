export enum DisputeState {
  Idle = 'Idle',
  Collecting = 'Collecting',
  Verifying = 'Verifying',
  Decision = 'Decision',
  Settling = 'Settling',
  Completed = 'Completed',
}

export enum Verdict {
  WinnerBuyer = 'WINNER_BUYER',
  WinnerSeller = 'WINNER_SELLER',
  Indeterminate = 'INDETERMINATE',
}
