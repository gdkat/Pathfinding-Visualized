import { useState } from "react";
import "./Accordion.css";
import clsx from "classnames";

const Accordion = (props) => {
  const { header, body } = props;
  const [active, setActive] = useState(false);

  const classes = clsx({
    "accordion-button": true,
    active: active,
  });

  return (
    <div className="accordion">
      <button className={classes} onClick={() => setActive(!active)}>
        {header}
      </button>
      {active && <div className="panel">{body}</div>}
    </div>
  );
};

export default Accordion;
