import { ReactNode } from "react";

export interface LinkItemGroup {
    data: Array<LinkItem>;
  }

  export interface LinkItem {
    title: string; 
    href: string 
}

export type PropsChildren = ReactNode | ReactNode[]

export type ErrorProp = {
  error: {
    response:{
      data: {
        message: string
      }
    }
  }
}