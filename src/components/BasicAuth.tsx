import React, { useContext, useEffect, useRef } from "react";
import "../assets/styles/BasicAuth.css";
import DefaultProps, { getCleanDefaultProps } from "../abstract/DefaultProps";
import useBasicAuth from "../hooks/useBasicAuth";
import { getCssConstant, isBlank, log } from "../utils/genericUtils";
import { AppContext } from "./App";
import { ApiExceptionFormat } from "../abstract/ApiExceptionFormat";
import { isHttpStatusCodeAlright } from "../utils/fetchUtils";
import Button from "./helpers/Button";
import Flex from "./helpers/Flex";


interface Props extends DefaultProps {

}


/**
 * 
 * @since 0.0.1
 */
export default function BasicAuth({...otherProps}: Props) {

    const { id, className, style, children } = getCleanDefaultProps(otherProps, "BasicAuth", true);

    const { login } = useBasicAuth();

    const { toast } = useContext(AppContext);

    const emailRef = useRef(null);
    const passwordRef = useRef(null);

    
    /**
     * Validate form, send login request and handle response.
     * 
     * @param event 
     */
    async function handleLogin(event): Promise<void> {

        const email = $(emailRef.current!).val() as string;
        const password = $(passwordRef.current!).val() as string;

        // case: form invalid
        if (!isFormValid(email, password)) {
            event.preventDefault();
            toast("Login", "Fülle alle Felder aus!", "error", 5000);
            return;
        }

        const jsonResponse = await login(email, password);

        handleLoginResponse(jsonResponse);
    }


    function handleLoginResponse(jsonResponse: Response | ApiExceptionFormat): void {

        const status = jsonResponse.status;
        // case: 200
        if (isHttpStatusCodeAlright(status)) {
            toast("Login", "Du bist eingeloggt", "success", 3000);
            return;
        }

        switch (status) {
            case 400:
                toast("Login", "Fülle alle Felder aus.", "error", 7000);
                break;

            case 401:
                toast("Login", "Passwort falsch.", "error", 7000);
                break;

            case 403: 
                toast("Login", "Zugang verweigert. Stelle sicher, dass du Admin Rechte hast.", "error", 7000);
                break;

            case 406: 
                toast("Login", "Benutzername/Email falsch.", "error", 7000);
                break;

            default: 
                toast("Login", "Login fehlgeschlagen.", "error", 7000);
        }
    }


    function isFormValid(email: string, password: string): boolean {

        // case: blank field
        if (isBlank(email) || isBlank(password))
            return false;

        return true;
    }


    return (
        <Flex
            id={id} 
            className={className}
            style={style}
            horizontalAlign="center"
            verticalAlign="center"
        >
            <div>
                {/* Form */}
                <Flex horizontalAlign="center">
                    <div className="formContainer">
                        <h2>Admin Login</h2>
                        <p>
                            <input 
                                id="emaiiOrUserName"
                                className="formInput"
                                type="text" 
                                name="emailOrUserName"
                                placeholder="Email oder Benutername" 
                                ref={emailRef} 
                                required
                            />
                        </p>

                        <p>
                            <input 
                                className="formInput"
                                type="password" 
                                name="password"
                                placeholder="Passwort" 
                                ref={passwordRef}
                                required
                            />
                        </p>

                        <Button 
                            id="Login"
                            className="fullWidth flexCenter"
                            handlePromise={handleLogin}
                            boxStyle={{
                                backgroundColor: "rgb(200, 200, 200)",
                                borderRadius: getCssConstant("borderRadius"),
                                height: "50px",
                            }}
                            childrenStyle={{
                                borderRadius: getCssConstant("borderRadius"),
                                color: getCssConstant("themeColor")
                            }}
                            hoverBackgroundColor="rgb(210, 210, 210)"
                        >
                            Login
                        </Button>
                    </div>
                </Flex>
            </div>
                
            {children}
        </Flex>
    )
}