import { useState } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import config from "../../components/config";

const Addraces = () => {
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuthContext();

  const [verseny, setVerseny] = useState("");
  const [file, setFile] = useState(null);

  const url = config.URL;

  const feldolgoz = (event) => {
    event.preventDefault();

    if (!user) {
      setError("Nem vagy bejelentkzve!");
      return;
    }

    const adatok = {
      verseny,
    };

    const elkuld = async () => {
      setIsLoading(true);
      setError(null);
      setSuccess(null);

      const adat = await fetch(url + "/verseny", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(adatok),
      });

      if (adat.ok) {
        const response = await adat.json();
        setIsLoading(false);
        setSuccess(response.msg);
      } else {
        const response = await adat.json();
        setIsLoading(false);
        setError(response.msg);
      }
    };

    elkuld();
  };

  const torles = async (e) => {
    e.preventDefault();
    setVerseny("");
    setError(null);
    setSuccess(null);
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const adat = await fetch(url + "/uploadVerseny", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        body: formData,
      });

      if (adat.ok) {
        const response = await adat.json();
        setIsLoading(false);
        setSuccess(response.msg);
      } else {
        const response = await adat.json();
        setIsLoading(false);
        setError(response.msg);
      }
    } catch (error) {
      setError(error);
    }
  };

  return (
    <div className="form-container">
      <div className="versenyContainer">
        {!isLoading ? <div></div> : <div className="loader"></div>}
        <form onSubmit={feldolgoz} className="addcomp">
          <h2>Vegyél fel egy versenyt!</h2>
          <div className="form-row">
            <input
              type="text"
              placeholder="Verseny neve"
              value={verseny}
              className="input"
              onChange={(e) => setVerseny(e.target.value)}
            />
          </div>
          <div className="button-row">
            <button disabled={isLoading} type="submit">
              Felvesz
            </button>
            <button disabled={isLoading} onClick={torles}>
              Törlés
            </button>
          </div>
          {error && <div className="error">{error}</div>}
          {success && <div className="success">{success}</div>}
        </form>
        <div className="multiAdding">
          <input type="file" onChange={handleFileChange} />
          <button onClick={handleUpload}>Feltölt</button>
        </div>
      </div>
    </div>
  );
};

export default Addraces;
