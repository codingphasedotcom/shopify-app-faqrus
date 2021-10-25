import { useEffect } from "react";
import { useRouter } from "next/router";
import { useappBridge, useRoutePropagation, useAppBridge } from '@shopify/app-bridge-react';
import { Redirect } from '@shopify/app-bridge/actions';

export const RoutePropagator = () => {
  const router = useRouter();
  const appBridge = useAppBridge();

  useRoutePropagation(router.asPath);

  useEffect(() => {
    const unsubscribe = appBridge.subscribe(Redirect.Action.App, ({path}) => {
      if (router.asPath !== path) {
        router.push(path);
      }
    });
    return unsubscribe;
  }, [router]);

  return null
}