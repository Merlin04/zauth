import {
    Button,
    Code,
    Container,
    Heading,
    Input,
    Link,
    List,
    ListItem,
    Spinner,
    Stack,
    Text
} from "@chakra-ui/react";
import Head from "next/head";
import { useState } from "react";

export default function Home() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    async function login(e: any) {
        e.preventDefault();
        setLoading(true);
        // Get the JWT
        const jwtRes = await fetch(`/api/getToken?appId=zauth-example`, {
            headers: {
                Authorization: btoa(username + ":" + password)
            }
        });
        if (jwtRes.status !== 200) {
            alert("Unauthorized");
        } else {
            const jwt = await jwtRes.text();
            // Use it
            const serverRes = await fetch(`/api/example?jwt=${jwt}`);
            alert(await serverRes.text());
        }
        setLoading(false);
    }

    const isHttp =
        typeof window !== "undefined" && window.location.protocol !== "https:";

    return (
        <Container marginY="4rem" maxWidth="85ch">
            <Head>
                <title>ZAuth</title>
                <meta
                    name="description"
                    content="An authentication API for ZephyrNet"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Stack direction="column">
                <Heading size="xl">ZAuth</Heading>
                <Heading size="md">An authentication API for ZephyrNet</Heading>
                <Text>
                    ZAuth is an API which lets you easily add authentication to
                    your ZephyrNet projects using the user accounts already on
                    the ZephyrNet server. It works with any programming language
                    that has support for or a library for JWTs (JSON web
                    tokens).
                </Text>
                <Heading size="md">Example</Heading>
                {isHttp && (
                    <Heading size="lg">
                        You&apos;re using HTTP, so I&apos;ve disabled these form
                        fields for security. Click{" "}
                        <Link href="https://zauth.zephyr" color="blue">
                            here to go to the https version
                        </Link>
                        .
                    </Heading>
                )}
                <Stack as="form" onSubmit={login} direction="row">
                    <Input
                        type="text"
                        placeholder="Username"
                        disabled={isHttp}
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <Input
                        type="password"
                        placeholder="Password"
                        disabled={isHttp}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button type="submit" disabled={isHttp} w="10rem">
                        Log in
                    </Button>
                </Stack>
                {loading && <Spinner />}
                <Text>
                    Don&apos;t worry, I&apos;m not stealing your password - feel
                    free to look at the source code at{" "}
                    <Code>/opt/zephyrnet/zauth.zephyr</Code>
                </Text>
                <Heading size="sm">
                    Example client source code (TypeScript)
                </Heading>
                <Code overflowX="auto">
                    <pre>
                        {`async function login() {
    // Get the JWT
    const jwtRes = await fetch(
        \`/api/getToken?appId=zauth-example\`, {
            headers: {
                "Authorization": btoa(username + ":" + password)
            }
        }
    );
    if(jwtRes.status !== 200) {
        alert("Unauthorized");
    }
    else {
        const jwt = await jwtRes.text();
        // Use it
        const serverRes = await fetch(\`/api/example?jwt=\${jwt}\`);
        alert(await serverRes.text());
    }
}`}
                    </pre>
                </Code>
                <Heading size="sm">
                    Example server source code (TypeScript/Next.js)
                </Heading>
                <Code overflowX="auto">
                    <pre>
                        {`import { NextApiRequest, NextApiResponse } from "next";
import { jwtVerify } from "jose/jwt/verify";
import parseJwk, { KeyLike } from "jose/webcrypto/jwk/parse";

let PUBLIC_KEY: KeyLike | undefined = undefined;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Parse ZAuth's public key if it hasn't been parsed already
    if(!PUBLIC_KEY) {
        PUBLIC_KEY = await parseJwk({
            "crv": "P-256",
            "kty": "EC",
            "x": "L3-19BuRNlPYCMGGmVR4yo6pXKdHWyg3pie4gZDOlLs",
            "y": "OWGfvyD2_KhMdTb-5Ie6HdlxqAJLXQl_zWkv9MYDxso"
        }, "ES256");
    }

    // Make sure the JWT was included in the request
    if(!req.query["jwt"] || Array.isArray(req.query["jwt"])) {
        res.status(401).end();
        return;
    }

    // Verify and get the data from the JWT
    const { payload } = await jwtVerify(req.query["jwt"], PUBLIC_KEY, {
        issuer: "zauth.zephyr"
    });
    
    if(payload.appId !== "zauth-example") {
        // This token isn't for this app, so don't accept it
        // This makes sure that someone can't take one person's token for one site
        // and use it on every site that they use ZAuth with
        res.status(401).end();
        return;
    }

    // Do something, now that we know that the person sending the request is who
    // they claim to be
    res.status(200).send(\`Hello, \${payload.user}!\`);
}`}
                    </pre>
                </Code>
                <Heading size="md">API reference</Heading>
                <Heading size="sm">
                    <Code>
                        <pre>/api/getToken</pre>
                    </Code>{" "}
                    (GET request)
                </Heading>
                <Text>Query parameters:</Text>
                <List>
                    <ListItem>
                        <Code>
                            <pre>appId</pre>
                        </Code>
                        : an ID that identifies what app a generated token is
                        for. This can be whatever string you want.
                    </ListItem>
                </List>
                <Text>Headers:</Text>
                <List>
                    <ListItem>
                        <Code>
                            <pre>Authorization</pre>
                        </Code>
                        : the username and password of the user on ZephyrNet.
                        This should be a base64 string that, when decoded, is in
                        the format{" "}
                        <Code>
                            <pre>username:password</pre>
                        </Code>
                        .
                    </ListItem>
                </List>
                <Text>
                    Returns: A signed JWT that can be used for authentication.
                </Text>
                <Heading size="sm">
                    <Code>
                        <pre>/api/getPublicKey</pre>
                    </Code>{" "}
                    (GET request)
                </Heading>
                <Text>Query parameters: none</Text>
                <Text>
                    Returns: The public key to use to validate JWTs on the
                    server side. You shouldn&apos;t need to directly call this
                    in your code, just copy the public key object from the
                    example.
                </Text>
            </Stack>
        </Container>
    );
}
