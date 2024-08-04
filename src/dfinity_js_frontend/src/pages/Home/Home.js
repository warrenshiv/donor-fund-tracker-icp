import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import * as Images from "../../assets/images";
import { Img } from "../../components/Img";
import { Button } from "../../components/Button";
import { Heading } from "../../components/Heading";
import { Text } from "../../components/Text";

export default function HomeLanding() {
  return (
    <>
      <Helmet>
        <title> Food Share 🥗</title>
        <meta
          name="description"
          content="Web site created using create-react-app"
        />
      </Helmet>
      <div className="w-full bg-white-A700 shadow-xs">
        <header className="flex items-center justify-center rounded bg-white-A700 p-2.5">
          <div className="mx-auto flex w-full max-w-[1341px] justify-center">
            <div className="flex w-full items-center justify-between gap-5">
              <Img
                src={Images.img_image_19}
                alt="imagenineteen"
                className="h-[44px] w-[9%]"
              />
              <div className="flex items-center gap-2">
                <Img
                  src={Images.img_bell_2}
                  alt="bell"
                  className="h-[30px] w-[30px]"
                />
                <span className="text-[16px] leading-[19px]">
                  +1-234-567-890
                </span>
              </div>
            </div>
          </div>
        </header>
        <div className="flex flex-col items-center">
          <div className="mx-auto mt-[62px] flex w-full max-w-[1185px] flex-col items-center justify-center gap-[23px] rounded-[20px] bg-gray-50_01 px-14 py-[92px] md:p-5">
            <Heading
              size="3xl"
              as="h2"
              className="mt-2 text-center !font-epilogue !text-teal-900"
            >
              Who are you
            </Heading>
            <Text size="xl" as="p" className="text-center !text-blue_gray-900">
              Select your role to Sign up
            </Text>
            <div className="w-[75%] flex flex-col justify-center gap-[27px] p-5">
              {/* <!-- Donor Card --> */}
              <div className="flex flex-col items-center rounded-lg bg-light_blue-50 p-[1px] sm:p-5">
                <Img
                  src={Images.img_image_62}
                  alt="Donor Icon"
                  className="h-[65px] w-[65px] rounded-full"
                />
                <Heading
                  size="xl"
                  as="h3"
                  className="mt-[18px] text-center !font-epilogue"
                >
                  Donor
                </Heading>
                <Text
                  as="p"
                  className="mb-[15px] mt-[9px] text-center !text-blue_gray-900"
                >
                  Businesses can register as donors, listing their type of business (restaurant, grocery store, etc.) and location.
                </Text>
                <Link
                  to="/donor?canisterId=br5f7-7uaaa-aaaaa-qaaca-cai"
                  className="no-underline"
                >
                  <Button
                    color="white_A700"
                    size="lg"
                    className="!rounded-[18px] border border-solid border-cyan-500"
                  >
                    <Img src={Images.img_arrow_right} alt="Right Arrow" />
                  </Button>
                </Link>
              </div>

              {/* <!-- Receiver Card --> */}
              <div className="flex flex-col items-center rounded-lg bg-light_blue-50 p-[1px] sm:p-5">
                <Img
                  src={Images.img_image_62}
                  alt="Receiver Icon"
                  className="h-[65px] w-[65px] rounded-full"
                />
                <Heading
                  size="xl"
                  as="h3"
                  className="mt-[18px] text-center !font-epilogue"
                >
                  Receiver
                </Heading>
                <Text
                  as="p"
                  className="mb-[15px] mt-[9px] text-center !text-blue_gray-900"
                >
                  Receivers (food banks, shelters) register detailing their needs, capacity, and receiving times.
                </Text>
                <Link
                  to="/receiver?canisterId=br5f7-7uaaa-aaaaa-qaaca-cai"
                  className="no-underline"
                >
                  <Button
                    color="white_A700"
                    size="lg"
                    className="!rounded-[18px] border border-solid border-cyan-500"
                  >
                    <Img src={Images.img_arrow_right} alt="Right Arrow" />
                  </Button>
                </Link>
              </div>

              {/* <!-- Driver Card --> */}
              <div className="flex flex-col items-center bg-light_blue-50 p-[1px] sm:p-5">
                <Img
                  src={Images.img_image_62}
                  alt="Driver Icon"
                  className="h-[50px] w-[50px] rounded-full"
                  style={{ borderRadius: "22px" }}
                />
                <Heading
                  size="xl"
                  as="h3"
                  className="mt-[12px] text-center !font-epilogue"
                >
                  Driver
                </Heading>
                <Text
                  as="p"
                  className="mb-[10px] mt-[6px] text-center !text-blue_gray-900"
                >
                  Integration with logistic service providers for pickup and delivery options, enabling seamless transfer of food from donors to receivers.
                </Text>
                <Link
                  to="/driver?canisterId=br5f7-7uaaa-aaaaa-qaaca-cai"
                  className="no-underline"
                >
                  <Button
                    color="white_A700"
                    size="lg"
                    className="!rounded-[12px] border border-solid border-cyan-500"
                  >
                    <Img src={Images.img_arrow_right} alt="Right Arrow" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
