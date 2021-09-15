import classNames from "classnames";
import React, { MouseEventHandler, ReactNode } from "react";
import { CgSpinner } from "react-icons/cg";

const SpinnerButton = ({
  isLoading,
  isDisabled,
  className,
  activeClassName = "btn-primary",
  disabledClassName = "btn-primary-disabled",
  onClick,
  children,
  title,
}: {
  isLoading?: boolean;
  isDisabled?: boolean;
  className?: string;
  activeClassName?: string;
  disabledClassName?: string;
  onClick?: MouseEventHandler;
  children: ReactNode;
  title?: string;
}) => {
  const disabled = isDisabled || isLoading;
  return (
    <button
      onClick={onClick}
      className={classNames(
        "leading-none inline-flex items-center justify-center",
        {
          [activeClassName]: !disabled,
          [disabledClassName]: disabled,
          "cursor-pointer": !disabled,
          "cursor-not-allowed": disabled,
        },
        className
      )}
      disabled={disabled}
      title={title}
    >
      {isLoading ? (
        <CgSpinner className="inline-block animate-spin" />
      ) : (
        children
      )}
    </button>
  );
};

export default SpinnerButton;
