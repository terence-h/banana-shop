import { FormEvent, PropsWithChildren } from "react";
import Section from "./section";

export default function Contact({ className }: ContactProps) {
    function onFormSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        alert(`Name: ${(e.currentTarget.elements[0] as HTMLInputElement).value}\n\nEmail: ${(e.currentTarget.elements[1] as HTMLInputElement).value}\n\nMessage:\n${(e.currentTarget.elements[2] as HTMLInputElement).value}`);
    }

    return (
        <Section sectionId="contact" className={className}>
            <div className="px-6 py-12 md:py-24 lg:px-8">
                <div className="mx-auto max-w-xl flex flex-col items-center justify-center text-center">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-yellow-400">Contact Us</h1>
                    <p className="mt-3 text-lg text-white mix-blend-difference">Feel free to ask us any questions!</p>
                </div>
                <form className="mx-auto mt-16 max-w-xl md:mt-20" onSubmit={onFormSubmit}>
                    <div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
                        <div className="md:col-span-2">
                            <label htmlFor="name" className="block text-sm font-semibold leading-6 text-white mix-blend-difference">Name<span className="text-yellow-400">*</span></label>
                            <div className="mt-2.5">
                                <input required type="text" name="name" id="name" autoComplete="name" placeholder="John Doe" className="block w-full rounded-md border-0 px-3.5 py-2 text-white bg-gray-950 mix-blend-difference shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-400 md:text-sm md:leading-6" />
                            </div>
                        </div>
                        <div className="md:col-span-2">
                            <label htmlFor="email" className="block text-sm font-semibold leading-6 text-white mix-blend-difference">Email<span className="text-yellow-400">*</span></label>
                            <div className="mt-2.5">
                                <input required type="email" name="email" id="email" autoComplete="email" placeholder="youremail@email.com" className="block w-full rounded-md border-0 px-3.5 py-2 text-white bg-gray-950 mix-blend-difference shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-400 md:text-sm md:leading-6" />
                            </div>
                        </div>
                        <div className="md:col-span-2">
                            <label htmlFor="message" className="block text-sm font-semibold leading-6 text-white mix-blend-difference">Message<span className="text-yellow-400">*</span></label>
                            <div className="mt-2.5">
                                <textarea name="message" id="message" rows={4} placeholder="Share your thoughts..." className="block w-full rounded-md border-0 px-3.5 py-2 text-white bg-gray-950 mix-blend-difference shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-400 md:text-sm md:leading-6"></textarea>
                            </div>
                        </div>
                    </div>
                    <div className="mt-10">
                        <button type="submit" className="bg-yellow-400 rounded-sm py-2 w-full block"><span className="text-white mix-blend-difference">Submit</span></button>
                    </div>
                </form>
            </div>

        </Section>
    );
}

interface ContactProps extends PropsWithChildren {
    className?: string;
}