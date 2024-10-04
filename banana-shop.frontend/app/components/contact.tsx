import { ChangeEvent, FormEvent, PropsWithChildren, useState } from "react";
import Section from "./section";

export default function Contact({ className, apiUrl }: ContactProps) {
    const [contactFormData, setContactFormData] = useState<ContactForm>({
        name: "",
        email: "",
        message: ""
    });

    const [postFormMessage, setPostFormMessage] = useState<string>("");

    function onFormSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const contactForm: ContactForm = {
            name: (e.currentTarget.elements[0] as HTMLInputElement).value,
            email: (e.currentTarget.elements[1] as HTMLInputElement).value,
            message: (e.currentTarget.elements[2] as HTMLTextAreaElement).value
        }

        fetch(`${apiUrl}/Contact`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(contactForm),
        }).then((response) => {
            if (response.ok) {
                setPostFormMessage("We have received your message! We will get back to you shortly.")
            } else {
                setPostFormMessage("Failed to send message. Please try again later.")
            }
            setContactFormData({ name: "", email: "", message: "" });
        }).catch(() => {
            setPostFormMessage("Failed to send message. Please try again later.")
            setContactFormData({ name: "", email: "", message: "" });
        });
    }

    function handleFormChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const { name, value } = e.target;
        setContactFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    }

    return (
        <Section sectionId="contact" className={className}>
            <div className="px-6 py-12 md:py-24 lg:px-8">
                <div className="mx-auto max-w-xl flex flex-col items-center justify-center text-center">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-yellow-400">Contact Us</h1>
                    <p className="mt-3 text-lg text-white mix-blend-difference">Feel free to ask us any questions!</p>
                </div>
                <form method="post" className="mx-auto mt-16 max-w-xl md:mt-20" onSubmit={onFormSubmit}>
                    <div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
                        <div className="md:col-span-2">
                            <label htmlFor="name" className="block text-sm font-semibold leading-6 text-white mix-blend-difference">Name<span className="text-yellow-400">*</span></label>
                            <div className="mt-2.5">
                                <input required type="text" name="name" id="name" autoComplete="name" placeholder="John Doe"
                                    onChange={handleFormChange}
                                    value={contactFormData.name}
                                    className="block w-full rounded-md border-0 px-3.5 py-2 text-white bg-gray-950 mix-blend-difference shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-400 md:text-sm md:leading-6" />
                            </div>
                        </div>
                        <div className="md:col-span-2">
                            <label htmlFor="email" className="block text-sm font-semibold leading-6 text-white mix-blend-difference">Email<span className="text-yellow-400">*</span></label>
                            <div className="mt-2.5">
                                <input required type="email" name="email" id="email" autoComplete="email" placeholder="johndoe@gmail.com"
                                    onChange={handleFormChange}
                                    value={contactFormData.email}
                                    className="block w-full rounded-md border-0 px-3.5 py-2 text-white bg-gray-950 mix-blend-difference shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-400 md:text-sm md:leading-6" />
                            </div>
                        </div>
                        <div className="md:col-span-2">
                            <label htmlFor="message" className="block text-sm font-semibold leading-6 text-white mix-blend-difference">Message<span className="text-yellow-400">*</span></label>
                            <div className="mt-2.5">
                                <textarea name="message" id="message" rows={4} placeholder="Share your thoughts..."
                                    onChange={handleFormChange}
                                    value={contactFormData.message}
                                    className="block w-full rounded-md border-0 px-3.5 py-2 text-white bg-gray-950 mix-blend-difference shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-400 md:text-sm md:leading-6"></textarea>
                            </div>
                        </div>
                    </div>
                    <div className="mt-10">
                        <button type="submit" className="bg-yellow-400 rounded-sm py-2 w-full block"><span className="text-white mix-blend-difference">Submit</span></button>
                    </div>
                    {postFormMessage.length > 0 &&
                        <div className="mt-10 text-center">
                            <span className="font-semibold text-white mix-blend-difference">{postFormMessage}</span>
                        </div>
                    }
                </form>
            </div>
        </Section>
    );
}

interface ContactProps extends PropsWithChildren {
    className?: string;
    apiUrl: string
}

interface ContactForm {
    id?: string;
    name: string;
    email: string;
    message: string;
}