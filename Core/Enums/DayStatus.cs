namespace Core.Enums
{
    public enum DayStatus
    {
        Pending = 0,
        Completed = 1,
        Skipped = 2,
        Missed = 3 // Optional, for auto-locking past days
    }
}
