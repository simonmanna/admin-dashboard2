"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardContent =
  exports.CardDescription =
  exports.CardAction =
  exports.CardTitle =
  exports.CardFooter =
  exports.CardHeader =
  exports.Card =
    void 0;
const React = require("react");
const utils_1 = require("../../lib/utils");

function Card({ className, ...props }) {
  return React.createElement("div", {
    "data-slot": "card",
    className: (0, utils_1.cn)(
      "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm",
      className
    ),
    ...props,
  });
}
exports.Card = Card;

function CardHeader({ className, ...props }) {
  return React.createElement("div", {
    "data-slot": "card-header",
    className: (0, utils_1.cn)(
      "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-[data-slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
      className
    ),
    ...props,
  });
}
exports.CardHeader = CardHeader;

function CardTitle({ className, ...props }) {
  return React.createElement("div", {
    "data-slot": "card-title",
    className: (0, utils_1.cn)("leading-none font-semibold", className),
    ...props,
  });
}
exports.CardTitle = CardTitle;

function CardDescription({ className, ...props }) {
  return React.createElement("div", {
    "data-slot": "card-description",
    className: (0, utils_1.cn)("text-muted-foreground text-sm", className),
    ...props,
  });
}
exports.CardDescription = CardDescription;

function CardAction({ className, ...props }) {
  return React.createElement("div", {
    "data-slot": "card-action",
    className: (0, utils_1.cn)(
      "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
      className
    ),
    ...props,
  });
}
exports.CardAction = CardAction;

function CardContent({ className, ...props }) {
  return React.createElement("div", {
    "data-slot": "card-content",
    className: (0, utils_1.cn)("px-6", className),
    ...props,
  });
}
exports.CardContent = CardContent;

function CardFooter({ className, ...props }) {
  return React.createElement("div", {
    "data-slot": "card-footer",
    className: (0, utils_1.cn)(
      "flex items-center px-6 [.border-t]:pt-6",
      className
    ),
    ...props,
  });
}
exports.CardFooter = CardFooter;
