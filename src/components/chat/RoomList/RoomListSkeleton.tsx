const RoomListSkeleton = () => {
  return (
    <div
      role="status"
      className="flex gap-4 px-5 py-3 items-center animate-pulse"
    >
      {/* Skeleton for Avatar */}
      <div className="w-10 h-10 rounded-full bg-gray-200"></div>
      {/* Skeleton for Text */}
      <div className="flex-1 max-w-full">
        {/* Skeleton for room name */}
        <div className="h-5 w-3/4 mb-2 bg-gray-200 rounded-full" />

        {/* Optional: Add additional skeleton lines if needed */}
      </div>
    </div>
  );
};

export default RoomListSkeleton;
