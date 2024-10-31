"use client"; 

import Link from 'next/link';
import { useRouter } from 'next/navigation'; 

const LoginForm = () => {
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
   
    router.push('/repositories');
  };

  return (
    <main className="bg-[url('/img/bg.png')] bg-cover bg-no-repeat h-screen">
      <div className="w-full h-screen flex justify-center items-center bg-white bg-opacity-10">
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
            <input type="text" name="username" placeholder="Username" className="py-2 px-3 w-full text-black text-lg font-light outline-none" />
            <input type="password" name="password" placeholder="Password" className="py-2 px-3 w-full text-black text-lg font-light outline-none mt-3" />
            <div className="flex mt-5 justify-between items-center">
              <Link href="/sign-up" className="text-white cursor-pointer transition hover:text-black">Not Yet Registered?</Link>
              <button type="submit" className="bg-black text-yellow font-medium py-2 px-8 transition hover:text-white">Sign In</button>
            </div>
          </form>
        </aside>
      </div>
    </main>
  );
};

export default LoginForm;
