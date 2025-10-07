import { useParams } from "react-router-dom";

import Nota from "@/components/Nota";

const MakeupInterview = () => {
  const params = useParams();
  const id = params.id;

  return <Nota id={id!} />;
};

export default MakeupInterview;
