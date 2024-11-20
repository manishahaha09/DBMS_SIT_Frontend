"use client"
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react"

const SignUp = () => {
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const router = useRouter();

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!email || !name || !password || !confirmPassword) {
      alert("Please fill in all fields!")
      return
    }
    try {
      const response = await axios.post("http://localhost:6969/api/signup", {
        name: name,
        email: email,
        password: password,
        confirmPassword: confirmPassword,
      })

      if (response.status === 201) {
        const { userId } = response.data

        localStorage.setItem("userId", userId)
        alert("Sign up successful")
        router.push("/repositories")
      }

    } catch (e) {
      alert(e.response.data)
    }
  }

  return (
    <main className="bg-[url('/img/bg.png')] bg-cover bg-no-repeat h-screen">
      <div className="w-full h-screen flex justify-center items-center bg-white bg-opacity-10">
        <aside className="bg-white w-full max-w-md rounded-xl bg-opacity-30 shadow-lg shadow-black">
          <h1 className="text-center text-white font-light text-4xl bg-yellow rounded-t-xl m-0 py-4">Sign Up</h1>
          <form className="p-6">
            <input type="text" name="" placeholder="Username" className="py-2 px-3 w-full text-black text-lg font-light outline-none" onChange={(e) => setName(e.target.value)} />
            <input type="email" name="" placeholder="Email" className="py-2 px-3 w-full text-black text-lg font-light outline-none mt-3" onChange={(e) => setEmail(e.target.value)} />
            <input type="text" name="" placeholder="Password" className="py-2 px-3 w-full text-black text-lg font-light outline-none mt-3" onChange={(e) => setPassword(e.target.value)} />
            <input type="text" name="" placeholder="Confirm Password" className="py-2 px-3 w-full text-black text-lg font-light outline-none mt-3" onChange={(e) => setConfirmPassword(e.target.value)} />
            <div className=" flex mt-5 justify-between items-center">
              <Link href="/" className="text-white cursor-pointer transition hover:text-black">Already Registered?</Link>
              <button type="submit" className="bg-black text-white font-medium py-2 px-8 transition hover:text-white" onClick={handleSignUp}>Sign Up</button>
            </div>
          </form>
        </aside>
      </div>
    </main>
  )
}

export default SignUp;
