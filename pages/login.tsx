import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {useForm} from "react-hook-form";
import * as z from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {
  signInWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
} from "firebase/auth";
import Head from "next/head";
import Link from "next/link";
import {toast} from "react-toastify";
import {
  doc,
  getFirestore,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import {LoginValidation} from "../lib/validation/user";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import {Input} from "../components/ui/input";
import {Button} from "../components/ui/button";
import {firebaseApp} from "../firebase";

export default function Login() {
  const router = useRouter();

  const auth = getAuth(firebaseApp);
  const db = getFirestore(firebaseApp);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        router.push("/");
      }
    });

    return () => {
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof LoginValidation>>({
    resolver: zodResolver(LoginValidation),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof LoginValidation>) => {
    try {
      setLoading(true);
      const {email, password} = values;
      const response = await signInWithEmailAndPassword(auth, email, password);
      const userDocRef = doc(db, "users", response.user.uid);
      await updateDoc(userDocRef, {
        online: true,
        lastLogin: serverTimestamp(),
      });
      toast.success("Login Successful!", {toastId: "login-success"});
      setLoading(false);
      router.push("/");
    } catch (error: any) {
      setLoading(false);
      toast.error(error.message, {toastId: "login-error"});
    }
  };

  return (
    <>
      <Head>
        <title>Login | Telegram Clone</title>
      </Head>
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="w-4/6 rounded-lg bg-white p-8 shadow-md">
          <h1 className="mb-4 text-3xl font-semibold">Telegram Login</h1>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="email"
                render={({field}) => (
                  <FormItem className="mb-4">
                    <FormLabel className="block text-gray-600">Email</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        className="w-full rounded border border-gray-300 p-2"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({field}) => (
                  <FormItem className="mb-4">
                    <FormLabel className="block text-gray-600">
                      Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        className="w-full rounded border border-gray-300 p-2"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" variant="primary" disabled={loading}>
                {loading ? "Processing..." : "Login"}
              </Button>
            </form>
          </Form>
          <p className="mt-5">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-bold text-blue-500 underline"
            >
              register
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
