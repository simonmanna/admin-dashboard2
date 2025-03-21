"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TableCaption =
  exports.TableCell =
  exports.TableHead =
  exports.TableRow =
  exports.TableFooter =
  exports.TableBody =
  exports.TableHeader =
  exports.Table =
    void 0;
const React = require("react");
const utils_1 = require("../../lib/utils");

function Table({ className, ...props }) {
  return React.createElement(
    "div",
    {
      "data-slot": "table-container",
      className: "relative w-full overflow-x-auto",
    },
    React.createElement("table", {
      "data-slot": "table",
      className: (0, utils_1.cn)("w-full caption-bottom text-sm", className),
      ...props,
    })
  );
}
exports.Table = Table;

function TableHeader({ className, ...props }) {
  return React.createElement("thead", {
    "data-slot": "table-header",
    className: (0, utils_1.cn)("[&_tr]:border-b", className),
    ...props,
  });
}
exports.TableHeader = TableHeader;

function TableBody({ className, ...props }) {
  return React.createElement("tbody", {
    "data-slot": "table-body",
    className: (0, utils_1.cn)("[&_tr:last-child]:border-0", className),
    ...props,
  });
}
exports.TableBody = TableBody;

function TableFooter({ className, ...props }) {
  return React.createElement("tfoot", {
    "data-slot": "table-footer",
    className: (0, utils_1.cn)(
      "bg-muted/50 border-t font-medium [&>tr]:last:border-b-0",
      className
    ),
    ...props,
  });
}
exports.TableFooter = TableFooter;

function TableRow({ className, ...props }) {
  return React.createElement("tr", {
    "data-slot": "table-row",
    className: (0, utils_1.cn)(
      "hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors",
      className
    ),
    ...props,
  });
}
exports.TableRow = TableRow;

function TableHead({ className, ...props }) {
  return React.createElement("th", {
    "data-slot": "table-head",
    className: (0, utils_1.cn)(
      "text-muted-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
      className
    ),
    ...props,
  });
}
exports.TableHead = TableHead;

function TableCell({ className, ...props }) {
  return React.createElement("td", {
    "data-slot": "table-cell",
    className: (0, utils_1.cn)(
      "p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
      className
    ),
    ...props,
  });
}
exports.TableCell = TableCell;

function TableCaption({ className, ...props }) {
  return React.createElement("caption", {
    "data-slot": "table-caption",
    className: (0, utils_1.cn)("text-muted-foreground mt-4 text-sm", className),
    ...props,
  });
}
exports.TableCaption = TableCaption;
