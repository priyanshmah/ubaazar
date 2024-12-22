'use client'

import { usePathname } from 'next/navigation'
import posthog from 'posthog-js'
import { PostHogProvider as PHProvider, usePostHog } from 'posthog-js/react'
import { useEffect } from 'react'

export function PostHogProvider({ children }) {
  const pathName = usePathname();
  const postHog = usePostHog();

  useEffect(() => {
    // initialize the posthog instance
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
      person_profiles: 'identified_only',
      capture_pageview: true,
      capture_pageleave: true,
    });

    // capture the pageview
    // if (pathName && postHog) {
    //   let url = window.origin + pathName;
    //   if(userSearchParams.toString()){
    //     url = url + `${userSearchParams.toString()}`
    //   }
    //   postHog.capture('$pageview', {
    //     current_url: url
    //   })
    // }

  }, [])

  return (
    <PHProvider client={posthog}>
      {children}
    </PHProvider>
  )
}