import React,{useState, useEffect, useRef, useMemo} from 'react';
import { serializeFormToJSON } from 'utils/serialize/formToJson'
import { inputHandler } from 'utils/check/inputHandler';
import { axiosPatch } from 'api/standardAxios';
import { useCSSLoader } from 'hooks/useCSSLoader';

// import "../../assets/css/user/changepw.css"

const ChangePW = () => {
  const cssFiles = useMemo(()=>[
    "/assets/css/user/changepw.css",
  ], []);

  useCSSLoader(cssFiles);

  const [password, setPassword] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const pwCheckRef = useRef(null); 

  useEffect(() => {
    if (!pwCheckRef.current) return;

    if (passwordCheck === "") {
      pwCheckRef.current.style.borderColor = "";
    } else if (password === passwordCheck) {
      pwCheckRef.current.style.borderColor = "limegreen";
    } else {
      pwCheckRef.current.style.borderColor = "red";
    }
  }, [password, passwordCheck]);

  const handleSubmit = async (e)=>{
    e.preventDefault();

    if (password !== passwordCheck) {
      alert("비밀번호를 다시 확인해주세요");
      return;
    }

    setSubmitting(true);

    try{
      const form = e.target;
      const jsonData = serializeFormToJSON(form);
      const { errors, processedData } = inputHandler(jsonData, form);

      const handle = {
        success: {
          location: "/login"
        },
        failure: {
          message: "오류가 발생하였습니다. 다시 시도해주세요.",
        }
      }

      console.log(errors);
      console.log(processedData);

      if (!errors) {
        await axiosPatch({ endpoint: "/api/me/password", body: processedData, useToken: true, handle});
      }

    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  }

  return(
    <div className="changepw-content-body">
      <h2 className="myInfo-content-header">비밀번호 변경</h2>

      <form className="changepw-form" id="changepw-form" onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="password">비밀번호 8글자 이상 숫자,특수문자,대문자 1개 이상</label>
          <input type="password" id="password" name="password"
                value={password} onChange={(e) => setPassword(e.target.value)}  required />
        </div>
        <div className="input-group">
          <label htmlFor="password-check">비밀번호 확인</label>
          <input type="password" id="password-check" name="password-check"
                value={passwordCheck} onChange={(e) => setPasswordCheck(e.target.value)} ref={pwCheckRef} required />
        </div>
        <button type="submit" disabled={submitting}>확인</button>
      </form>
    </div>
  );
};

export default ChangePW;