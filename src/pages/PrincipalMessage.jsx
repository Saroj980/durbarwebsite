import React, { useEffect, useState } from "react";
import api from "../api";
import PageTransition from "../components/PageTransition";
import "../css/PrincipalMessage.css";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const fadeRight = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" } }
};

const fadeLeft = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" } }
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } }
};

export default function PrincipalMessage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    api.get("/principal-message")
      .then(res => setData(res.data))
      .catch(() => setData(null));
  }, []);

  if (!data) return null;

  return (
    <PageTransition>
      <section className="principal-full py-5">
        <div className="container">

          {/* Title */}
          <motion.h1
            className="principal-title mb-4"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
          >
            Message from the Principal
          </motion.h1>

          <motion.div
            className="row align-items-start g-4"
            variants={stagger}
            initial="hidden"
            animate="visible"
          >

            {/* LEFT CONTENT */}
            <motion.div className="col-lg-8" variants={fadeRight}>
              <div className="message-box p-4 shadow-sm bg-white">

                <h4 className="fw-bold mb-0">{data.name}</h4>
                <div className="designation text-muted">{data.designation}</div>

                <hr className="soft-divider my-2" />

                <p className="lead fw-semibold mb-3">
                  {data.title || "Message from the Principal"}
                </p>
                <div
                  className="message-text rich-text"
                  dangerouslySetInnerHTML={{ __html: data.message }}
                ></div>


              </div>
            </motion.div>

            {/* RIGHT IMAGE */}
            <motion.div className="col-lg-4 text-center" variants={fadeLeft}>
              <div className="portrait-wrapper shadow-sm">
                <img
                  src={`${process.env.REACT_APP_API_BASE_URL}storage/${data.photo}`}
                  alt="Principal"
                  className="portrait-img"
                />
              </div>
            </motion.div>

          </motion.div>

        </div>
      </section>
    </PageTransition>
  );
}
