import { TreeRendererProps } from "react-sortable-tree";
import classnames from "clsx";
import "./tree-node.css";
import React, { Children, cloneElement } from "react";

export default function TreeNode(props: TreeRendererProps) {
  const {
    children,
    listIndex,
    swapFrom = 0,
    swapLength = 0,
    swapDepth,
    scaffoldBlockPxWidth,
    lowerSiblingCounts,
    connectDropTarget,
    isOver,
    draggedNode,
    canDrop,
    treeIndex,
    treeId, // Delete from otherProps
    getPrevRow, // Delete from otherProps
    node, // Delete from otherProps
    path, // Delete from otherProps
    rowDirection,
    ...otherProps
  } = props;

  const rowDirectionClass = rowDirection === "rtl" ? "rst__rtl" : null;

  // Construct the scaffold representing the structure of the tree
  const scaffoldBlockCount = lowerSiblingCounts.length;
  const scaffold: JSX.Element[] = [];
  const level = path.length - 1;
  lowerSiblingCounts.forEach((lowerSiblingCount, i) => {
    let lineClass = "";
    if (level > 0) {
      if (lowerSiblingCount > 0) {
        // At this level in the tree, the nodes had sibling nodes further down

        if (listIndex === 0) {
          // Top-left corner of the tree
          // +-----+
          // |     |
          // |  +--+
          // |  |  |
          // +--+--+
          lineClass =
            "rst__lineHalfHorizontalRight rst__lineHalfVerticalBottom";
        } else if (i === scaffoldBlockCount - 1) {
          // Last scaffold block in the row, right before the row content
          // +--+--+
          // |  |  |
          // |  +--+
          // |  |  |
          // +--+--+
          lineClass = "rst__lineHalfHorizontalRight rst__lineFullVertical";
        } else if (i > 0) {
          // Simply connecting the line extending down to the next sibling on this level
          // +--+--+
          // |  |  |
          // |  |  |
          // |  |  |
          // +--+--+
          lineClass = "rst__lineFullVertical";
        }
      } else if (listIndex === 0) {
        // Top-left corner of the tree, but has no siblings
        // +-----+
        // |     |
        // |  +--+
        // |     |
        // +-----+
        lineClass = "rst__lineHalfHorizontalRight";
      } else if (i === scaffoldBlockCount - 1) {
        // The last or only node in this level of the tree
        // +--+--+
        // |  |  |
        // |  +--+
        // |     |
        // +-----+
        lineClass = "rst__lineHalfVerticalTop rst__lineHalfHorizontalRight";
      }
    }

    scaffold.push(
      <div
        key={`pre_${1 + i}`}
        style={{ width: scaffoldBlockPxWidth }}
        className={classnames("rst__lineBlock", lineClass, rowDirectionClass)}
      />
    );

    if (treeIndex !== listIndex && i === swapDepth) {
      // This row has been shifted, and is at the depth of
      // the line pointing to the new destination
      let highlightLineClass = "";

      if (listIndex === swapFrom + swapLength - 1) {
        // This block is on the bottom (target) line
        // This block points at the target block (where the row will go when released)
        highlightLineClass = "rst__highlightBottomLeftCorner";
      } else if (treeIndex === swapFrom) {
        // This block is on the top (source) line
        highlightLineClass = "rst__highlightTopLeftCorner";
      } else {
        // This block is between the bottom and top
        highlightLineClass = "rst__highlightLineVertical";
      }

      let style;
      if (rowDirection === "rtl") {
        style = {
          width: scaffoldBlockPxWidth,
          right: scaffoldBlockPxWidth * i
        };
      } else {
        // Default ltr
        style = {
          width: scaffoldBlockPxWidth,
          left: scaffoldBlockPxWidth * i
        };
      }

      scaffold.push(
        <div
          // eslint-disable-next-line react/no-array-index-key
          key={i}
          style={style}
          className={classnames(
            "rst__absoluteLineBlock",
            highlightLineClass,
            rowDirectionClass
          )}
        />
      );
    }
  });

  let style;
  if (rowDirection === "rtl") {
    style = { right: scaffoldBlockPxWidth * scaffoldBlockCount };
  } else {
    // Default ltr
    style = { left: scaffoldBlockPxWidth * scaffoldBlockCount };
  }

  return connectDropTarget(
    <div {...otherProps} className={classnames("rst__node", rowDirectionClass)}>
      {scaffold}

      <div className="rst__nodeContent" style={style}>
        {Children.map(children, (child) =>
          cloneElement(child, {
            isOver,
            canDrop,
            draggedNode
          })
        )}
      </div>
    </div>
  );
}
