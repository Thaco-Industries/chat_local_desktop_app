import BlueLogo from '../../assets/icons/BlueLogo';
import WhiteLogo from '../../assets/icons/whiteLogo';
import LoginForm from '../../components/forms/LoginForm';

export default function Login() {
  return (
    <div className="flex h-screen flex-col text-center p-12 md:p-0 md:flex-row md:overflow-hidden md:text-start md:bg-primary gap-[10%] md:gap-0">
      <div className="overflow-hidden bg-white w-full md:bg-primary md:w-2/5 md:relative flex justify-center items-center">
        <div className="hidden md:flex justify-center items-center w-[80%] h-full">
          <WhiteLogo />
        </div>
        {/* <div className="hidden xl:block xl:absolute xl:top-1/2 xl:left-1/2 xl:translate-x-[-50%] xl:translate-y-[-50%] max-w-[80%]">
          <WhiteLogo height={120} width={420} />
        </div> */}

        <div className="block md:hidden m-auto w-[250px] h-[60px]">
          <BlueLogo />
        </div>
      </div>
      <div className="flex bg-white flex-col justify-center w-full md:w-3/5 md:rounded-ss-3xl md:rounded-es-3xl">
        <LoginForm />
      </div>
    </div>
  );
}
