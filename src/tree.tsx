import React, { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import SortableTree, { TreeItem } from "react-sortable-tree";
import Node from "./node";
import TreeNode from "./tree-node";

const isTouchDevice = !!("ontouchstart" in window || navigator.maxTouchPoints);
const dndBackend = isTouchDevice ? TouchBackend : HTML5Backend;

export default function Tree() {
  const [treeData, setTreeData] = useState<TreeItem[]>([
    { title: "Chicken", expanded: true, children: [{ title: "Egg" }] },
    { title: "Chicken", expanded: true, children: [{ title: "Egg" }] }
  ]);
  return (
    <DndProvider backend={dndBackend}>
      <div>
        <span>
          This is {!isTouchDevice && "not "}a touch-supporting browser
        </span>
        <div style={{ height: 300 }}>
          <SortableTree
            treeData={treeData}
            onChange={(result) => setTreeData(result)}
            canDrag={({ node }) => !node.noDragging}
            isVirtualized={false}
            canDrop={({ nextParent }) => !nextParent || !nextParent.noChildren}
            theme={{
              nodeContentRenderer: Node,
              treeNodeRenderer: TreeNode
            }}
          />
        </div>
      </div>
    </DndProvider>
  );
}
