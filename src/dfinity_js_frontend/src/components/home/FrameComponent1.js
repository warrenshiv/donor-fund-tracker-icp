import React, { useMemo } from "react";
import styles from "./FrameComponent1.module.css";
import { Img } from "../../components/Img";
import * as Images from "../../assets/images";

const FrameComponent1 = ({ className = "", frameDivPadding, maskGroup }) => {
  const frameSectionStyle = useMemo(() => {
    return {
      padding: frameDivPadding,
    };
  }, [frameDivPadding]);

  return (
    <section
      className={[styles.frameParent, className].join(" ")}
      style={frameSectionStyle}
    >
      <div className={styles.frameGroup}>
        <header className={styles.rectangleParent}>
          <div className={styles.frameChild} />
          <div className={styles.frameWrapper}>
            <div className={styles.frameContainer}>
              <Img
                src={Images.imgGroup2320}
                className={styles.frameItem}
                loading="lazy"
                alt="logo"
              />
              <a className={styles.fundit}>FundIt</a>
            </div>
          </div>
          <nav className={styles.frameNav}>
            <nav className={styles.homeParent}>
              <div className={styles.home}>Home</div>
              <div className={styles.about}>About</div>
              <div className={styles.faqs}>FAQs</div>
            </nav>
          </nav>
          {/* <div className={styles.button}>
            <b className={styles.label}>Get Started</b>
          </div> */}
        </header>
        <div className={styles.shapes}>
          <div className={styles.shapesChild} />
          <div className={styles.shapesItem} />
          <div className={styles.shapesInner} />
        </div>
        <div className={styles.frameDiv}>
          <div className={styles.frameParent1}>
            <div className={styles.maskGroupParent}>
              <Img
                src={Images.imgMaskGroup}
                className={styles.maskGroupIcon}
                loading="lazy"
                alt=""
              />
              <h1 className={styles.fundraiseForAContainer}>
                <p className={styles.fundraiseFor}>Fundraise for</p>
                <p className={styles.fundraiseFor}>a great cause</p>
              </h1>
            </div>
            <div
              className={styles.vulputateEuScelerisque}
            >{`Vulputate eu scelerisque felis imperdiet proin fermentum leo. Est lorem ipsum dolor sit. `}</div>
          </div>
          <button className={styles.rectangleGroup}>
            <div className={styles.rectangle} />
            <b className={styles.donateNow}>DONATE NOW</b>
          </button>
        </div>
      </div>
      <div className={styles.frameWrapper1}>
        <div className={styles.rectangleContainer}>
          <div className={styles.frameInner} />
          <div className={styles.rectangleDiv} />
          <h2 className={styles.raisedSoFar}>Raised so far</h2>
          <div className={styles.raisedAmount}>$250,027</div>
        </div>
      </div>
    </section>
  );
};

export default FrameComponent1;
