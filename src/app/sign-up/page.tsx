import Link from "next/link";

const SignUp = () => {
    return(
    <main className="bg-[url('/img/bg.png')] bg-cover bg-no-repeat h-screen">
      <div className="w-full h-screen flex justify-center items-center bg-white bg-opacity-10">
        <aside className="bg-white w-full max-w-md rounded-xl bg-opacity-30 shadow-lg shadow-black">
          <h1 className="text-center text-black font-light text-4xl bg-yellow rounded-t-xl m-0 py-4">Sign Up</h1>
          <form className="p-6">
            <input type="text" name="" placeholder="Username" className="py-2 px-3 w-full text-black text-lg font-light outline-none" />
            <input type="email" name="" placeholder="Email" className="py-2 px-3 w-full text-black text-lg font-light outline-none mt-3" />
            <input type="text" name="" placeholder="Password" className="py-2 px-3 w-full text-black text-lg font-light outline-none mt-3" />
            <input type="text" name="" placeholder="Confirm Password" className="py-2 px-3 w-full text-black text-lg font-light outline-none mt-3" />
            <div className=" flex mt-5 justify-between items-center">
              <Link href="/" className="text-white cursor-pointer transition hover:text-black">Already Registered?</Link>
              <button type="submit" className="bg-black text-yellow font-medium py-2 px-8 transition hover:text-white">Sign Up</button>
            </div>
          </form>
        </aside>
      </div>
    </main>
    )
}

export default SignUp;