import React, { useState } from 'react';
import { useActiveForm } from '../../hooks/useApplicationForm';
import Loading from '../../components/Loading';
import { useNavigate } from 'react-router-dom';

const Overview: React.FC = () => {
    const { data: form, isLoading, error } = useActiveForm()
    const navigate = useNavigate();
    const [wait, setWait] = useState(false)

    if (isLoading) return <Loading />

    if (error) return <p>Something went wrong: {error.message}</p>

    async function handleApply() {
        setWait(true);
        navigate(`/apply/f/${form!.id}/${form!.sections[0].sectionId}`)
        setWait(false);

    }
    return (
        <div className="mt-5 mx-auto max-w-5xl w-full px-5 py-5 font-sans leading-relaxed">
            <h1 className='mb-3 text-5xl text-black'>Overview</h1>
            <div className="flex items-start justify-between mb-5">
                <div className="flex flex-col">
                    <h2 className="text-blue text-2xl">Hack4Impact-UMD New Member</h2>
                    <h3 className="text-blue text-2xl">Application {form!.semester}</h3>
                </div>
                {
                    <button
                        onClick={handleApply}
                        disabled={wait}
                        className="cursor-pointer inline-flex items-center justify-center px-10 py-2 rounded-full bg-black 
                text-white transition-colors hover:bg-darkgray">
                        Apply
                    </button>
                }
            </div>
            <div className="font-[Karla] text-sm font-normal leading-tight text-justify [text-justify:inter-word]">

                <p>
                    Lorem ipsum dolor sit amet consectetur. Laoreet tempus dui diam a vestibulum dapibus aliquam egestas. Id amet laoreet in ullamcorper. Sociis dictum eget orci at ornare. Id condimentum dui condimentum in pharetra. Interdum at in augue eget est. Condimentum orci tellus lectus urna arcu non. Hac sed lectus parturient curabitur aliquet amet consectetur purus. Tincidunt mauris imperdiet enim ut id pellentesque. Enim sociis arcu aliquam bibendum. Viverra proin eu mi lacinia vel. Facilisi sit scelerisque amet ornare. Interdum odio dignissim ac massa diam vel aliquet at nec. Vitae dui malesuada id amet sit ultricies malesuada sagittis velit.
                </p>
                <p>
                    Velit mi amet mauris aenean semper nunc morbi duis. Morbi nunc nulla eu felis. Enim magna in fermentum arcu varius amet nec arcu. Consectetur magna gravida ultricies condimentum viverra. Commodo nec mattis pellentesque mi pretium. A maecenas risus porttitor enim lectus lacinia ut eget sit. Viverra molestie aliquam elementum integer semper feugiat ut. Sagittis nisl amet tortor malesuada tristique ac non eget. Mattis non volutpat venenatis tincidunt a vel magna aliquam. Odio nibh vestibulum mauris eu. A vel massa pellentesque aliquam sit cras vel eleifend elementum. In ornare lacus magna id tincidunt et arcu convallis. Arcu ut tortor quis metus mi nisi ut lacus.
                </p>
                <p>
                    <br></br>
                </p>
                <p>
                    Imperdiet et amet adipiscing ut integer quam. Purus lectus tincidunt purus in nulla mattis nulla diam. In integer blandit orci nulla nunc a. Eget gravida venenatis bibendum scelerisque phasellus. Semper facilisi felis suspendisse lobortis elit in. In aliquet quis ut purus. Eget morbi adipiscing iaculis duis. Integer in donec purus velit ut vel. Tincidunt urna eget gravida vitae porta nulla ac sagittis. Orci consectetur hendrerit metus lacinia duis. In suspendisse iaculis habitant habitasse senectus scelerisque molestie. Lectus enim sed varius lorem arcu placerat. Mauris massa nulla egestas interdum euismod vestibulum phasellus.
                </p>
                <p>
                    Enim rhoncus in hendrerit ultricies neque pharetra feugiat. Turpis elit sed at id egestas est. Pulvinar ipsum lobortis fermentum vel justo augue vulputate. Blandit posuere elit vehicula vestibulum. Mi sit tellus cras varius pretium dui feugiat. Vitae sed pellentesque aliquet natoque viverra scelerisque egestas amet. Amet viverra integer sem faucibus sodales ut in sit cursus. Vel rhoncus interdum cum quis fames faucibus ut id massa. Ac egestas eget adipiscing amet aliquet nibh purus dictum quis. Accumsan felis mattis facilisis tincidunt pharetra posuere. Massa libero mauris volutpat vestibulum ultricies nulla velit nec. Quisque eros porttitor morbi tempor tristique. Congue dignissim vel lacus faucibus nibh eget.
                </p>
                <p>
                    <br></br>
                </p>
                <p>
                    Luctus mauris at adipiscing ac mauris. Et tincidunt accumsan iaculis tristique suspendisse in sed rutrum volutpat. In commodo volutpat laoreet integer senectus neque. Etiam montes sed nulla in quam eu lacus. Mi pharetra elementum commodo pretium. Molestie enim pellentesque suspendisse lectus in nec sapien consectetur quis. Sem laoreet urna blandit purus diam at. Nunc amet ultrices etiam tortor dui amet. Quam amet integer ante quam nisl non nisl. Turpis velit ut at quis quis non volutpat vulputate vulputate. Condimentum egestas non consequat dignissim. Ornare sapien a in lacus cras accumsan eget dolor libero.
                </p>
                <p>
                    Dictumst donec elementum scelerisque ipsum eget mus sed iaculis ultrices. Venenatis dolor vitae integer et sapien donec nulla.
                </p>

            </div>
        </div>
    );
};

export default Overview;
