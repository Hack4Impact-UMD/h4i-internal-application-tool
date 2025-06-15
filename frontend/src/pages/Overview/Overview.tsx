import React, { useState } from 'react';
import { useActiveForm } from '../../hooks/useApplicationForm';
import Loading from '../../components/Loading';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Overview: React.FC = () => {
    const { data: form, isLoading, error } = useActiveForm()
    const navigate = useNavigate();
    const [wait, setWait] = useState(false)

    if (isLoading) return <Loading />
    if (error) return <p>Something went wrong: {error.message}</p>

    if (!form) return <div className="mt-5 mx-auto max-w-5xl w-full px-5 py-5 font-sans leading-relaxed">
        <h1 className='mb-3 text-5xl text-black'>Overview</h1>
        <div className="flex gap-2 flex-col sm:flex-row items-start justify-between mb-5">
            There are no active forms at the moment.
        </div>
    </div>

    async function handleApply() {
        setWait(true);
        navigate(`/apply/f/${form!.id}/${form!.sections[0].sectionId}`)
        setWait(false);
    }
    return (
        <div className="mt-5 mx-auto max-w-5xl w-full px-5 py-5 font-sans leading-relaxed">
            <h1 className='mb-3 text-5xl text-black'>Overview</h1>
            <div className="flex gap-2 flex-col sm:flex-row items-start justify-between mb-5">
                <div className="flex flex-col">
                    <h2 className="text-blue text-2xl">Hack4Impact-UMD New Member</h2>
                    <h3 className="text-blue text-2xl">Application {form.semester}</h3>
                </div>
                {
                    <Button
                        onClick={handleApply}
                        disabled={wait}
                        className="w-full sm:w-fit cursor-pointer inline-flex items-center justify-center px-10 py-2 rounded-full bg-black 
                text-white transition-colors hover:bg-darkgray">
                        Apply
                    </Button>
                }
            </div>
            <div className="font-[Karla] text-sm font-normal leading-tight text-justify [text-justify:inter-word]">
                <p>{form.description}</p>
            </div>
        </div>
    );
};

export default Overview;
