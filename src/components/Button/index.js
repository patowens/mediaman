import "./index.css";

function Button({ text, loading, fn }) {
  return <button onClick={fn} className="Button">{text}</button>;
}

export default Button;
