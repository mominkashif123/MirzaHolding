import React from "react";
import Navbar from "./Navbar.jsx";
import { Tilt } from "react-tilt";
import { privateData } from "../assets/private.js";

const ProjectCard = ({ name, description, icon }) => {
    return (
        <Tilt
            options={{
                max: 45,
                scale: 1,
                speed: 450,
            }}
            className="bg-gray-100 p-5 rounded-3xl glow"
            style={{ width: '300px', height: '350px' }}
        >
            <div className="flex flex-col h-full justify-between">
                <div>
                    <p className="text-black text-[16px] mb-4">{description}</p>
                </div>
                <div className="flex items-center justify-between">
                    <h3 className="text-black font-bold text-[26px]">{name}</h3>
                    <img
                        src={icon}
                        alt="project_image"
                        className="w-16 h-16 object-cover rounded-full"
                    />
                </div>
            </div>
        </Tilt>
    );
};

const PrivateServices = () => {
    return (
        <>
            <Navbar />
            <div className="min-h-[100vh] bg-gray-200 flex flex-col justify-center items-center py-20 mt-[5vh]">
                <h1 className="font-baskervville text-black text-center font-bold text-[36px] mb-10">
                    Private Services
                </h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 place-items-center">
                    {privateData.map((data, index) => (
                        <ProjectCard
                            key={index}
                            name={data.name}
                            description={data.description}
                            icon={data.icon}
                        />
                    ))}
                </div>
            </div>
        </>
    );
};

export default PrivateServices;
