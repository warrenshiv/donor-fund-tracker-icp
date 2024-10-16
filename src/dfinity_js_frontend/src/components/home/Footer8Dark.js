import React from "react";
import styles from "./Footer8Dark.module.css";
import * as Images from "../../assets/images";
import { Img } from "../../components/Img";

const Footer8Dark = ({ className = "", group29 }) => {
  return (
    <footer className={[styles.footer8Dark, className].join(" ")}>
      <div className={styles.background} />
      <div className={styles.footer8DarkInner}>
        <div className={styles.frameChild} />
      </div>
      <div className={styles.footerContent}>
        <div className={styles.frameParent}>
          <div className={styles.frameWrapper}>
            <div className={styles.frameGroup}>
              <div className={styles.vectorWrapper}>
                <Img
                  className={styles.vectorIcon}
                  loading="lazy"
                  alt=""
                  src={Images.imgVector}
                />
              </div>
              <h1 className={styles.fundit}>FundIt</h1>
            </div>
          </div>
          <div className={styles.footerLocation}>
            <div className={styles.locationParent}>
              <div className={styles.location}>
                <Img
                  className={styles.roundPlace24pxIcon}
                  loading="lazy"
                  alt=""
                  src={Images.imgRoundplace24px}
                />
                <div className={styles.faulconerDriveWrapper}>
                  <div className={styles.faulconerDrive}>
                    345 Faulconer Drive, Suite 4 • Charlottesville, CA, 12345
                  </div>
                </div>
              </div>
              <div className={styles.phoneParent}>
                <div className={styles.phone}>
                  <Img
                    className={styles.roundPhone24pxIcon}
                    loading="lazy"
                    alt=""
                    src={Images.imgRoundphone24px}
                  />
                  <div className={styles.faulconerDriveWrapper}>
                    <div className={styles.space}>(123) 456-7890</div>
                  </div>
                </div>
                <div className={styles.phoneIcons}>
                  <Img
                    className={styles.roundLocalPrintshop24pxIcon}
                    loading="lazy"
                    alt=""
                    src={Images.imgRoundlocalprintshop24px}
                  />
                  <div className={styles.faulconerDriveWrapper}>
                    <div className={styles.div}>(123) 456-7890</div>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.footerSocial}>
              <div className={styles.faulconerDriveWrapper}>
                <div className={styles.socialMedia}>Social Media</div>
              </div>
              <div className={styles.socialIcons}>
                <div className={styles.twitterBlack1}>
                  <div className={styles.rectangle} />
                  <Img
                    className={styles.twitterIcon}
                    alt=""
                    src={Images.imgTwitter}
                  />
                </div>
                <Img
                  className={styles.roundLocalPrintshop24pxIcon}
                  loading="lazy"
                  alt=""
                  src={Images.imgLinkedinBlack1}
                />
                <Img
                  className={styles.roundLocalPrintshop24pxIcon}
                  loading="lazy"
                  alt=""
                  src={Images.imgYoutubeColor1}
                />
                <Img
                  className={styles.roundLocalPrintshop24pxIcon}
                  loading="lazy"
                  alt=""
                  src={Images.imgInstagramBlack1}
                />
                <img className={styles.socialIconsChild} alt="" src={group29} />
                <img
                  className={styles.roundLocalPrintshop24pxIcon}
                  loading="lazy"
                  alt=""
                  src={Images.imgInstagramBlack1}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.footerCopyright}>
        <div className={styles.footerCopyrightChild} />
        <div className={styles.footerLinks}>
          <div className={styles.navigation}>
            <div className={styles.aboutUs}>About us</div>
            <div className={styles.contactUs}>Contact us</div>
            <div className={styles.help}>Help</div>
            <a className={styles.privacyPolicy}>Privacy Policy</a>
            <div className={styles.disclaimer}>Disclaimer</div>
          </div>
          <div className={styles.copyright2018}>
            Copyright © 2024• FundIt Inc.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer8Dark;
