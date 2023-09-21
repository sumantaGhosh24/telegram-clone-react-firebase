import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {useForm} from "react-hook-form";
import * as z from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
} from "firebase/auth";
import Head from "next/head";
import Link from "next/link";
import {toast} from "react-toastify";

import {RegisterValidation} from "../lib/validation/user";
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

export default function Register() {
  const router = useRouter();

  const auth = getAuth(firebaseApp);

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

  const form = useForm<z.infer<typeof RegisterValidation>>({
    resolver: zodResolver(RegisterValidation),
    defaultValues: {
      email: "",
      password: "",
      cf_password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof RegisterValidation>) => {
    try {
      setLoading(true);
      const {email, password} = values;
      await createUserWithEmailAndPassword(auth, email, password);
      toast.success("Register Successful!", {toastId: "register-success"});
      setLoading(false);
      router.push("/");
    } catch (error: any) {
      setLoading(false);
      toast.error(error.message, {toastId: "register-error"});
    }
  };

  return (
    <>
      <Head>
        <title>Register | Telegram Clone</title>
      </Head>
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="w-4/6 rounded-lg bg-white p-8 shadow-md">
          <h1 className="mb-4 text-3xl font-semibold">Telegram Register</h1>
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
              <FormField
                control={form.control}
                name="cf_password"
                render={({field}) => (
                  <FormItem className="mb-4">
                    <FormLabel className="block text-gray-600">
                      Confirm Password
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
                {loading ? "Processing..." : "Register"}
              </Button>
            </form>
          </Form>
          <p className="mt-5">
            Already have an account?{" "}
            <Link href="/login" className="font-bold text-blue-500 underline">
              login
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
