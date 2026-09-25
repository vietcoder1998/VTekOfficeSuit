"use client";

import React, { forwardRef } from "react";
import {
  Container,
  ContainerHeader,
  ContainerBody,
  ContainerFooter,
  ContainerProps,
} from "./container";

export interface CardProps extends ContainerProps {}

export const Card = forwardRef<HTMLElement, CardProps>(
  ({ className = "", variant = "card", children, ...rest }, ref) => {
    return (
      <Container
        ref={ref}
        variant={variant}
        className={`base-card ${className}`.trim()}
        {...rest}
      >
        {children}
      </Container>
    );
  }
);
Card.displayName = "BaseCard";

export const CardHeader = forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className = "", children, ...rest }, ref) => {
    return (
      <ContainerHeader
        ref={ref}
        className={`base-card-header ${className}`.trim()}
        {...rest}
      >
        {children}
      </ContainerHeader>
    );
  }
);
CardHeader.displayName = "BaseCardHeader";

export const CardBody = forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement> & { scrollable?: boolean }
>(({ className = "", children, scrollable = false, ...rest }, ref) => {
  return (
    <ContainerBody
      ref={ref}
      scrollable={scrollable}
      className={`base-card-body ${className}`.trim()}
      {...rest}
    >
      {children}
    </ContainerBody>
  );
});
CardBody.displayName = "BaseCardBody";

export const CardFooter = forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className = "", children, ...rest }, ref) => {
    return (
      <ContainerFooter
        ref={ref}
        className={`base-card-footer ${className}`.trim()}
        {...rest}
      >
        {children}
      </ContainerFooter>
    );
  }
);
CardFooter.displayName = "BaseCardFooter";

export {
  Card as BaseCard,
  CardHeader as BaseCardHeader,
  CardBody as BaseCardBody,
  CardFooter as BaseCardFooter,
};
