
'use client';

import { motion } from 'framer-motion';
import { ForwardRefExoticComponent, RefAttributes } from 'react';
import type { MotionProps } from 'framer-motion';

/** Proxy wrapper so you can use `Motion.div`, `Motion.h1`, … inside server files. */
export const Motion = new Proxy(motion, {
  get(target, prop: string) {
    // @ts-expect-error – dynamic property
    return target[prop] as ForwardRefExoticComponent<
      MotionProps & RefAttributes<HTMLElement>
    >;
  },
}) as typeof motion;
