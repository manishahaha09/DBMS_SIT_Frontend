"use client";

import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const LoginForm = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter();
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Username or Password field empty")
      return
    }
    try {
      const response = await axios.post("http://localhost:6969/api/login", {
        email: email,
        password: password,
      })
      if (response.status === 201) {
        const { userId } = response.data

        localStorage.setItem("userId", userId)
        alert("Log In successful")
        router.push('/repositories');
      }
    } catch (error) {
      alert(error.response.data)
      return
    }
  };


  return (
    <main className="bg-[url('/img/bg.png')] bg-cover bg-no-repeat h-screen">
      <div className="w-full h-screen flex justify-center items-center bg-white bg-opacity-10 p-12">
        <div className="w-full h-screen flex justify-center items-center bg-white bg-opacity-10">
          <div>
            <aside className="bg-white w-full max-w-md rounded-xl bg-opacity-30 shadow-lg shadow-black p-4">
              <h1 className="text-center text-gray-800 font-bold text-4xl">SIT</h1>
              <h2 className="text-center text-gray-800 font-bold text-2xl">Sub-Version Management System</h2>
            </aside>
          </div>
        </div>
        <aside className="bg-white w-full max-w-md rounded-xl bg-opacity-30 shadow-lg shadow-black">
          <h1 className="text-center text-black font-light text-4xl bg-yellow rounded-t-xl m-0 py-4">Sign In</h1>
          <form className="p-6" onSubmit={handleSubmit}>
            <input
              type="text"
              name="email"
              placeholder="Email"
              className="py-2 px-3 w-full text-black text-lg font-light outline-none"
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="py-2 px-3 w-full text-black text-lg font-light outline-none mt-3"
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="flex mt-5 justify-between items-center">
              <Link href="/sign-up" className="text-white cursor-pointer transition hover:text-black">Not Yet Registered?</Link>
              <button type="submit" className="bg-black text-white font-medium py-2 px-8 transition hover:text-white">Sign In</button>
            </div>
          </form>
        </aside>
      </div>
    </main>
  );
};

export default LoginForm;
