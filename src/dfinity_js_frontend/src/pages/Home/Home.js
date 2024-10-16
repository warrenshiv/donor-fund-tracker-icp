import React, { useCallback } from "react";
import FrameComponent1 from "../../components/home/FrameComponent1";
import DivcssS1fwqh from "../../components/home/DivcssS1fwqh";
import Divsibling from "../../components/home/Divsibling";
import Divactive from "../../components/home/Divactive";
import DivcssS1fwqh1 from "../../components/home/DivcssS1fwqh1";
import { useNavigate } from "react-router-dom";
import FrameComponent2 from "../../components/home/FrameComponent2";
import Footer8Dark from "../../components/home/Footer8Dark";
import styles from "./NewHome.module.css";
import * as Images from "../../assets/images";
import { Img } from "../../components/Img";

const NewHome = () => {
  const navigate = useNavigate();

  const onSvgIconClick = useCallback(() => {
    navigate("/frame-02");
  }, [navigate]);

  const onSvgIconClick1 = useCallback(() => {
    navigate("/frame-03");
  }, [navigate]);

  return (
    <div className={styles.newhome}>
      <div className={styles.newhomeChild} />
      <Img className={styles.newhomeItem} alt="" src={Images.imgGroup3848} />
      <Img className={styles.newhomeInner} alt="" src={Images.imgGroup38491} />
      <FrameComponent1 maskGroup={Images.imgMaskGroup} />
      <div className={styles.transparencyParent}>
        <b className={styles.transparency}>Transparency</b>
        <div className={styles.trackEveryStep}>
          Track Every Step: Monitor your donation from submission to usage with
          complete visibility
        </div>
        <Img
          className={styles.layersSvgrepocomIcon}
          alt=""
          src={Images.imgLayersSvgrepocom}
        />
      </div>
      <div className={styles.divcssS1fwqhParent}>
        <DivcssS1fwqh />
        <div className={styles.divcssS1fwqh}>
          <div className={styles.theStressAnd}>
            The stress and loneliness courses … taught me how to comfort myself.
          </div>
          <div className={styles.aliciaCanada}>Alicia, Canada</div>
          <div className={styles.onManagingThe}>
            on managing the trauma of sexual assault
          </div>
          <Img className={styles.frameIcon} alt="" src={Images.imgFrame} />
        </div>
        <Divsibling />
        <Divactive frame="/frame-3.svg" />
        <div className={styles.divsibling}>
          <div className={styles.headspaceProvidesMe}>
            Headspace provides me
          </div>
          <div className={styles.withA}>with … a connection to</div>
          <div className={styles.myselfAndA}>myself, and a</div>
          <div className={styles.disconnectionFrom}>disconnection from</div>
          <div className={styles.negativeThoughts}>negative thoughts,</div>
          <div className={styles.feelingsAndSensations}>
            feelings, and sensations.
          </div>
          <div className={styles.keriUk}>Keri, UK</div>
          <div className={styles.onFindingHer}>on finding her happy place</div>
          <img className={styles.frameIcon} alt="" src="/frame.svg" />
        </div>
        <DivcssS1fwqh1 />
        <div className={styles.divcssS1fwqh1}>
          <div className={styles.aHappyWorkforce}>
            A happy workforce leads to a happy work environment.
          </div>
          <div className={styles.jaimeSpain}>Jaime, Spain</div>
          <div className={styles.onTheBenefitsContainer}>
            <p className={styles.onTheBenefits}>
              on the benefits of his employees embracing meditation
            </p>
          </div>
          <Img className={styles.frameIcon} alt="" src={Images.imgFrame} />
        </div>
        <b className={styles.testimonials}>Testimonials</b>
        <Img className={styles.svgIcon} alt="" src={Images.imgSvg1} />
        <Img
          className={styles.svgIcon1}
          alt=""
          src={Images.imgSvg_11}
          onClick={onSvgIconClick}
        />
      </div>
      <div className={styles.frameParent}>
        <div className={styles.divcssS1fwqhGroup}>
          <Img
            className={styles.divcssS1fwqhIcon}
            alt=""
            src={Images.imgDivcsss1fwqh}
          />
          <Img
            className={styles.divcssS1fwqhIcon1}
            alt=""
            src={Images.imgDivcsss1fwqh_1}
          />
          <Img
            className={styles.divsiblingIcon}
            alt=""
            src={Images.imgDivsibling}
          />
          <Img
            className={styles.divactiveIcon}
            alt=""
            src={Images.imgDivactive}
          />
          <Img
            className={styles.divsiblingIcon1}
            alt=""
            src={Images.imgDivsibling_1}
          />
          <Img
            className={styles.divcssS1fwqhIcon2}
            alt=""
            src={Images.imgDivcsss1fwqh_2}
          />
          <Img
            className={styles.divcssS1fwqhIcon3}
            alt=""
            src={Images.imgDivcsss1fwqh_3}
          />
        </div>
        <b className={styles.testimonials1}>Testimonials</b>
        <Img className={styles.svgIcon} alt="" src={Images.imgSvg1} />
        <Img className={styles.svgIcon3} alt="" src={Images.imgSvg_11} />
      </div>
      <div className={styles.frameParent}>
        <div className={styles.divcssS1fwqhContainer}>
          <Img
            className={styles.divcssS1fwqhIcon}
            alt=""
            src={Images.imgDivcsss1fwqh_4}
          />
          <Img
            className={styles.divcssS1fwqhIcon1}
            alt=""
            src={Images.imgDivcsss1fwqh_5}
          />
          <Img
            className={styles.divsiblingIcon2}
            alt=""
            src={Images.imgDivsibling_2}
          />
          <Img
            className={styles.divactiveIcon1}
            alt=""
            src={Images.imgDivactive_1}
          />
          <Img
            className={styles.divsiblingIcon3}
            alt=""
            src={Images.imgDivsibling_3}
          />
          <Img
            className={styles.divcssS1fwqhIcon6}
            alt=""
            src={Images.imgDivcsss1fwqh_6}
          />
          <Img
            className={styles.divcssS1fwqhIcon7}
            alt=""
            src={Images.imgDivcsss1fwqh_7}
          />
        </div>
        <b className={styles.testimonials1}>Testimonials</b>
        <Img className={styles.svgIcon} alt="" src={Images.imgSvg1} />
        <Img className={styles.svgIcon3} alt="" src={Images.imgSvg_11} />
      </div>
      <section className={styles.frameSection}>
        <div className={styles.frameContainer}>
          <FrameComponent2 />
          <div className={styles.frameDiv}>
            <DivcssS1fwqh propLeft="-602.7px" />
            <div className={styles.divcssS1fwqh2}>
              <div className={styles.theStressAnd}>
                The stress and loneliness courses … taught me how to comfort
                myself.
              </div>
              <div className={styles.aliciaCanada}>Alicia, Canada</div>
              <div className={styles.onManagingThe}>
                on managing the trauma of sexual assault
              </div>
              <Img className={styles.frameIcon} alt="" src={Images.imgFrame} />
            </div>
            <Divsibling
              propTop="246.1px"
              propLeft="-244.5px"
              propMinWidth="unset"
              propMinWidth1="unset"
            />
            <Divactive
              propTop="260.5px"
              propLeft="113.7px"
              propOpacity="0.4"
              frame="/frame-10.svg"
            />
            <div className={styles.divsibling1}>
              <div className={styles.headspaceProvidesMe}>
                Headspace provides me
              </div>
              <div className={styles.withA}>with … a connection to</div>
              <div className={styles.myselfAndA}>myself, and a</div>
              <div className={styles.disconnectionFrom}>disconnection from</div>
              <div className={styles.negativeThoughts}>negative thoughts,</div>
              <div className={styles.feelingsAndSensations}>
                feelings, and sensations.
              </div>
              <div className={styles.keriUk}>Keri, UK</div>
              <div className={styles.onFindingHer}>
                on finding her happy place
              </div>
              <Img className={styles.frameIcon} alt="" src={Images.imgFrame} />
            </div>
            <DivcssS1fwqh1
              propTop="260.5px"
              propLeft="830.1px"
              propMinWidth="86.5px"
            />
            <div className={styles.divcssS1fwqh3}>
              <div className={styles.aHappyWorkforce}>
                A happy workforce leads to a happy work environment.
              </div>
              <div className={styles.jaimeSpain}>Jaime, Spain</div>
              <div className={styles.onTheBenefitsContainer}>
                <p className={styles.onTheBenefits}>
                  on the benefits of his employees embracing meditation
                </p>
              </div>
              <Img className={styles.frameIcon} alt="" src={Images.imgFrame} />
            </div>
            <h1 className={styles.testimonials3}>Testimonials</h1>
            <Img
              className={styles.svgIcon6}
              alt=""
              src={Images.imgSvg1}
              onClick={onSvgIconClick1}
            />
            <Img className={styles.svgIcon3} alt="" src={Images.imgSvg_11} />
          </div>
        </div>
      </section>
      <Footer8Dark group29={Images.imgGroup29} />
    </div>
  );
};

export default NewHome;
