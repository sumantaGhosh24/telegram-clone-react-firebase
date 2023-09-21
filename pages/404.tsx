import Head from "next/head";
import Link from "next/link";

export default function Custom404() {
  return (
    <>
      <Head>
        <title>404 Not Found | Telegram Clone</title>
      </Head>
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="w-4/6 rounded-lg bg-white p-8 text-center shadow-md">
          <h1 className="mb-4 text-4xl font-semibold">404 - Page Not Found</h1>
          <p className="mb-8 text-lg text-gray-600">
            The page you are looking for does not exist.
          </p>
          <Link href="/">
            <p className="text-blue-500 hover:underline">
              Go back to the homepage
            </p>
          </Link>
        </div>
      </div>
    </>
  );
}
