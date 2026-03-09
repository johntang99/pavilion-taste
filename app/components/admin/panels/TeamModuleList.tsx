interface ContentFileRef {
  id: string;
  path: string;
}

interface TeamModuleListProps {
  teamPageFile: ContentFileRef | null;
  teamDataFile: ContentFileRef | null;
  isTeamPageSettingsSelected: boolean;
  isTeamDataSettingsSelected: boolean;
  isTeamDataFileActive: boolean;
  activeTeamCategoryIndex: number;
  activeTeamMemberIndex: number;
  categories: any[];
  members: any[];
  setActiveFile: (file: ContentFileRef | null) => void;
  setActiveTeamCategoryIndex: (index: number) => void;
  setActiveTeamMemberIndex: (index: number) => void;
  addTeamCategory: () => void;
  removeTeamCategory: (index: number) => void;
  addTeamMember: () => void;
  removeTeamMember: (index: number) => void;
}

export function TeamModuleList({
  teamPageFile,
  teamDataFile,
  isTeamPageSettingsSelected,
  isTeamDataSettingsSelected,
  isTeamDataFileActive,
  activeTeamCategoryIndex,
  activeTeamMemberIndex,
  categories,
  members,
  setActiveFile,
  setActiveTeamCategoryIndex,
  setActiveTeamMemberIndex,
  addTeamCategory,
  removeTeamCategory,
  addTeamMember,
  removeTeamMember,
}: TeamModuleListProps) {
  return (
    <>
      {teamPageFile && (
        <button
          type="button"
          onClick={() => {
            setActiveFile(teamPageFile);
            setActiveTeamCategoryIndex(-1);
            setActiveTeamMemberIndex(-1);
          }}
          className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
            isTeamPageSettingsSelected
              ? 'bg-[var(--primary)] text-white'
              : 'hover:bg-gray-100 text-gray-700'
          }`}
        >
          <div className="font-medium">Page Settings</div>
          <div className="text-xs opacity-70">hero</div>
        </button>
      )}
      {teamDataFile && (
        <button
          type="button"
          onClick={() => {
            setActiveFile(teamDataFile);
            setActiveTeamCategoryIndex(-1);
            setActiveTeamMemberIndex(-1);
          }}
          className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
            isTeamDataSettingsSelected
              ? 'bg-[var(--primary)] text-white'
              : 'hover:bg-gray-100 text-gray-700'
          }`}
        >
          <div className="font-medium">Team Data</div>
          <div className="text-xs opacity-70">departments / members</div>
        </button>
      )}

      <div className="pt-1 text-[11px] font-semibold text-gray-500 uppercase">Departments</div>
      <button
        type="button"
        onClick={addTeamCategory}
        disabled={!isTeamDataFileActive}
        className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs text-gray-700 hover:bg-gray-50 disabled:opacity-50"
      >
        Add Department
      </button>
      <button
        type="button"
        disabled={!isTeamDataFileActive || activeTeamCategoryIndex < 0}
        onClick={() => removeTeamCategory(activeTeamCategoryIndex)}
        className="w-full px-3 py-2 rounded-lg border border-red-200 text-xs text-red-600 hover:bg-red-50 disabled:opacity-50"
      >
        Delete Selected Department
      </button>
      {categories.map((category: any, index: number) => (
        <button
          key={`${category?.id || category}-${index}`}
          type="button"
          onClick={() => {
            if (teamDataFile) setActiveFile(teamDataFile);
            setActiveTeamCategoryIndex(index);
            setActiveTeamMemberIndex(-1);
          }}
          className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
            isTeamDataFileActive && activeTeamCategoryIndex === index
              ? 'bg-[var(--primary)] text-white'
              : 'hover:bg-gray-100 text-gray-700'
          }`}
        >
          <div className="font-medium">{category?.name || category || `Department ${index + 1}`}</div>
          <div className="text-xs opacity-70">{category?.id || category || `#${index + 1}`}</div>
        </button>
      ))}

      <div className="pt-2 text-[11px] font-semibold text-gray-500 uppercase">Members</div>
      <button
        type="button"
        onClick={addTeamMember}
        disabled={!isTeamDataFileActive}
        className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs text-gray-700 hover:bg-gray-50 disabled:opacity-50"
      >
        Add Member
      </button>
      <button
        type="button"
        disabled={!isTeamDataFileActive || activeTeamMemberIndex < 0}
        onClick={() => removeTeamMember(activeTeamMemberIndex)}
        className="w-full px-3 py-2 rounded-lg border border-red-200 text-xs text-red-600 hover:bg-red-50 disabled:opacity-50"
      >
        Delete Selected Member
      </button>
      {members.map((member: any, index: number) => (
        <button
          key={`${member?.id || 'member'}-${index}`}
          type="button"
          onClick={() => {
            if (teamDataFile) setActiveFile(teamDataFile);
            setActiveTeamMemberIndex(index);
            setActiveTeamCategoryIndex(-1);
          }}
          className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
            isTeamDataFileActive && activeTeamMemberIndex === index
              ? 'bg-[var(--primary)] text-white'
              : 'hover:bg-gray-100 text-gray-700'
          }`}
        >
          <div className="font-medium">{member?.name || `Member ${index + 1}`}</div>
          <div className="text-xs opacity-70">{member?.id || `#${index + 1}`}</div>
        </button>
      ))}
    </>
  );
}
