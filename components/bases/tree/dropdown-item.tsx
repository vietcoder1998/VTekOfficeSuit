"use client";

import React from "react";
import { TreeItem, type TreeItemProps } from "../tree-item";

export interface TreeDropdownItemProps extends TreeItemProps {
  dropdownItemId?: string;
}

/**
 * Base TreeDropdownItem Component — Section 853
 * Standard child dropdown item using canonical Base TreeItem.
 * Ensures zero inline styles, 100% Base styling, semantic IDs, and theme tokens.
 */
export const TreeDropdownItem = React.memo(function TreeDropdownItem({
  id,
  dropdownItemId,
  className = "",
  level = 1,
  showLeafSpacer = true,
  ...props
}: TreeDropdownItemProps) {
  const effectiveId = id || dropdownItemId;

  return (
    <TreeItem
      id={effectiveId}
      level={level}
      showLeafSpacer={showLeafSpacer}
      className={`tree-dropdown-item ${className}`.trim()}
      {...props}
    />
  );
});
