import { Suspense } from "react";
import OAuth2CallbackClient from "./OAuth2CallbackClient";

export default function OAuth2CallbackPage() {
  return (
    <Suspense fallback={<div />}>
      <OAuth2CallbackClient />
    </Suspense>
  );
}
