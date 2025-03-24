import {
  LockOpenIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { LockClosedIcon } from "@heroicons/react/24/solid";
import { Tooltip } from "../ui/Tooltip";

interface TableToolbarProps {
  selectedUsers: string[];
  onBlock: () => void;
  onUnblock: () => void;
  onDelete: () => void;
}

export function TableToolbar({
  selectedUsers,
  onBlock,
  onUnblock,
  onDelete,
}: TableToolbarProps) {
  const hasSelectedUsers = selectedUsers.length > 0;
  const selectedCount = selectedUsers.length;

  return (
    <div className="flex items-center gap-2">
      <Tooltip content={hasSelectedUsers ? `Block ${selectedCount} selected user(s)` : "Select users to block"}>
        <button
          onClick={onBlock}
          disabled={!hasSelectedUsers}
          className="inline-flex items-center px-4 py-2 border hover:text-white text-sm font-medium rounded-md shadow-sm bg-white text-red-600 border-red-600 hover:bg-red-500 focus:outline-none focus:ring-1 focus:ring-red-600  cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Block selected users"
        >
          <LockClosedIcon className="size-5 mr-1" /> 
          Block
        </button>
      </Tooltip>
      
      <Tooltip content={hasSelectedUsers ? `Unblock ${selectedCount} selected user(s)` : "Select users to unblock"}>
        <button
          onClick={onUnblock}
          disabled={!hasSelectedUsers}
          className="inline-flex items-center p-2 border hover:text-white rounded-md shadow-sm bg-white text-green-600 border-green-600 hover:bg-green-500 focus:outline-none focus:ring-1 focus:ring-green-600  cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Unblock selected users"
        >
          <LockOpenIcon className="size-5 mr-1" />
          Unblock
        </button>
      </Tooltip>
      
      <Tooltip content={hasSelectedUsers ? `Delete ${selectedCount} selected user(s)` : "Select users to delete"}>
        <button
          onClick={onDelete}
          disabled={!hasSelectedUsers}
          className="inline-flex items-center p-2 border rounded-md shadow-sm bg-white text-red-600 border-red-600 hover:bg-red-600 hover:text-white focus:outline-none focus:ring-1 focus:ring-red-600 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Delete selected users"
        >
          <TrashIcon className="size-5 mr-1" />
          Delete
        </button>
      </Tooltip>
      
      {hasSelectedUsers && (
        <span className="ml-2 text-sm text-gray-500">
          {selectedCount} user{selectedCount !== 1 ? 's' : ''} selected
        </span>
      )}
    </div>
  );
}
