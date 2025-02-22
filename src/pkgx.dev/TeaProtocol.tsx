import React from "react";
import { Container, Grid, Typography, Button, Box, Link, Stack } from "@mui/material";
import teaImage from "../../public/imgs/tea-icon.svg"; // Hero Image
import backgroundPattern from "../assets/pkgx-bg-pattern-right.svg"; // Full-Page Background Image

// Feature Section Data
const features = [
  { title: "A New Brew: The Journey From Homebrew to tea", description: "Homebrew changed how developers managed software. Now, tea is evolving the model for the open-source era—not just packaging software but packaging incentives. By leveraging smart contracts, tokenized rewards, and a global dependency tree, tea ensures that contributions are recognized, ranked, and rewarded across the entire open-source stack." },
  { title: "teaRANK: The PageRank for Open Source", description: "Open source powers everything, but which packages power open source? teaRANK, tea’s novel global dependency tree, ranks software based on real usage and impact—just like PageRank did for the web. Integrated into Chai, our open-source intelligence engine, teaRANK ensures that the most critical packages receive the support they deserve." },
  { title: "PKGX & teaBase: Developer Experience, Reinvented", description: "Developers deserve magic, not headaches. PKGX, our next-gen package manager, makes installing, updating, and securing dependencies effortless. Meanwhile, teaBase serves as the on-chain registry, ensuring that every piece of open source has a permanent, verifiable home—with incentives baked in." },
  { title: "Open Source Should Be Rewarding. Now It Is.", description: "For too long, open source has been powered by passion, not paychecks. tea is changing the economics of open source, ensuring that every maintainer, contributor, and developer gets their fair share. Whether through staking, governance, or direct rewards, tea.xyz is about sustaining open source for the long run—so you can keep building, innovating, and, of course, sipping the tea." }
];

interface TeaStats {
  totalBlocks: string;
  dailyTransactions: string;
  totalTransactions: string;
  walletAddresses: string;
}

const TeaProtocol = () => {
  const [stats, setStats] = React.useState<TeaStats | null>(null);

  React.useEffect(() => {
    const fetchTeaStats = async () => {
      // lambda proxy to bypass CORS
      const response = await fetch(`https://yo2fkzmf2rh33u2b3bi3xhtqyi0toyqz.lambda-url.us-east-1.on.aws/?url=/stats`);
      const data = await response.json();

      setStats({
        totalBlocks: parseInt(data.total_blocks).toLocaleString(),
        dailyTransactions: `${(parseInt(data.transactions_today) / 1000000).toFixed(2)}M`,
        totalTransactions: parseInt(data.total_transactions).toLocaleString(),
        walletAddresses: parseInt(data.total_addresses).toLocaleString()
      });
    };

    fetchTeaStats();
  }, []);

  // Social Proof Data
  const socialProofData = stats ? [
    { number: stats.totalBlocks, label: "Total Blocks" },
    { number: stats.dailyTransactions, label: "Daily Transactions" },
    { number: stats.totalTransactions, label: "Total Transactions" },
    { number: stats.walletAddresses, label: "Wallet Addresses" },
  ] : [
    { number: "1,212,925", label: "Total Blocks" },
    { number: "2.17M", label: "Daily Transactions" },
    { number: "72,160,103", label: "Total Transactions" },
    { number: "81,122,220", label: "Wallet Addresses" },
  ];

  return (
    <Box
      sx={{
        backgroundImage: `url(${backgroundPattern})`,
        backgroundSize: "contain",
        backgroundPosition: "bottom right",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
        width: "100%",
      }}
    >
      {/* Hero Section */}
      {/* Hero Section */}
<Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
  <Grid container spacing={4} alignItems="center">

    {/* Left Column - Text Content */}
    <Grid item xs={12} md={6}>
      <Typography
        sx={{ fontSize: "14px", fontWeight: 500, textTransform: "uppercase", color: "#F26212", mb: 1 }}
      >
        From the creator of homebrew
      </Typography>
      <Typography
        variant="h1"
        gutterBottom
        sx={{ fontWeight: 800, fontSize: "48px", lineHeight: "58px", color: "#EDF2EF" }}
      >
        Something New is Brewing:  <span style={{ color: "#F26212" }}>The Future of Open Source is On-Chain</span>
      </Typography>
      <Typography variant="body1" paragraph sx={{ color: "#EDF2EF", mb: 2 }}>
        The world of open source is long overdue for a revolution. At tea.xyz, we’re brewing something powerful—an <strong>Optimism Stack-based Layer-2 Ethereum network</strong> designed to <strong>incentivize, sustain, and supercharge open-source development</strong>. With <strong>best-in-class developer tools, a global dependency graph ranking packages like search engines rank the web</strong>, and a commitment to <strong>rewarding the builders of open-source infrastructure</strong>, tea is the <strong>next evolution from Homebrew to a fully decentralized ecosystem</strong>.
      </Typography>
      <Typography variant="body1" paragraph sx={{ color: "#EDF2EF", mb: 2 }}>
        We’re bringing something new <strong>to Ethereum</strong>, with a <strong>custom precompile that enables GPG keys to sign transactions natively</strong>—meaning <strong>developers can finally use their existing cryptographic identities to interact with the network</strong>. This opens the door to <strong>seamless rewards, better security, and an entirely new developer experience</strong> for open source.
      </Typography>
      <Typography variant="body1" paragraph sx={{ color: "#EDF2EF", mb: 3 }}>
        As a proud part of the <strong>Optimism ecosystem</strong>, we are incredibly excited about the future of Ethereum—especially with the <strong>Pectra upgrades</strong> unlocking new frontiers for Layer-2 scalability and application design. tea is built to <strong>welcome the next wave of hundreds of thousands of open-source developers</strong> and finally deliver the <strong>scaling promises of blockchain</strong> to the people who build the internet’s foundation. If you’ve ever contributed to open source, it’s time to claim your seat at the table—and <strong>sip the tea</strong>.
      </Typography>
      <Button
          variant="contained"
          color="primary"
          size="large"
          href="https://tea.xyz"
          sx={{ textTransform: "none" }}
        >
          Get started on testnet
        </Button>
    </Grid>

    {/* Right Column - Hero Image (Hidden on Mobile) */}
    <Grid item xs={12} md={6} sx={{ display: { xs: "none", md: "block" } }}>
      <Box
        component="img"
        src="/imgs/tea-icon.svg"
        alt="Tea Protocol Homepage"
        sx={{
          width: "100%",
          height: "auto",
          borderRadius: "8px",
        }}
      />
    </Grid>

  </Grid>
</Container>


      {/* Metrics Section */}
      <Container maxWidth="lg" sx={{ textAlign: "center", py: { xs: 6, md: 10 } }}>
        <Box sx={{ maxWidth: "700px", mx: "auto" }}>
          <Typography
            variant="h2"
            gutterBottom
            sx={{ fontWeight: 800, fontSize: "32px", lineHeight: "42px", color: "#EDF2EF" }}
          >
            Everyone's <span style={{ color: "#F26212" }}>sipping the tea</span>.
          </Typography>
          <Typography variant="body1" paragraph sx={{ color: "#EDF2EF" }}>
            tea Protocol is trusted by hundreds of thousands of developers, contributors, and organizations worldwide.
            See the impact we've made in the open-source community.
          </Typography>
        </Box>

        <Grid container spacing={4} justifyContent="center">
          {socialProofData.map((item, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Typography sx={{ fontWeight: "bold", fontSize: "32px", color: "#EDF2EF" }}>
                {item.number}
              </Typography>
              <Typography variant="body1" sx={{ color: "#EDF2EF" }}>
                {item.label}
              </Typography>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Feature Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Grid container spacing={4} alignItems="center">

          {/* Left Side */}
          <Grid item xs={12} md={4}>
            <Typography
              variant="h2"
              sx={{ fontWeight: 800, fontSize: "32px", lineHeight: "42px", color: "#EDF2EF", mb: 2 }}
            >
              There's something brewing for <span style={{ color: "#F26212" }}>everyone</span>.
            </Typography>
            <Typography variant="body1" paragraph sx={{ color: "#EDF2EF" }}>
              There are plenty of ways for developers and speculators alike to participate in tea's testnet. This is just any web3 project; tea is the network for developers, and they're changing the way the world interacts with open source software.
            </Typography>
          </Grid>

          {/* Right Side (Feature List) */}
          <Grid item xs={12} md={8}>
            <Grid container spacing={4}>
              {features.map((feature, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Typography variant="h6" fontWeight="bold" sx={{ color: "#EDF2EF", lineHeight: "1.3em", mb: 2 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#EDF2EF" }}>
                    {feature.description}
                  </Typography>
                </Grid>
              ))}
            </Grid>
          </Grid>

        </Grid>
      </Container>

{/* Final Call-to-Action Section */}
<Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
  <Grid container spacing={4} alignItems="center">

    {/* Left Column - Text & Buttons */}
    <Grid item xs={12} md={6}>
      <Typography
        variant="h2"
        gutterBottom
        sx={{ fontWeight: 800, fontSize: "32px", lineHeight: "42px", color: "#EDF2EF" }}
      >
        Ready to <span style={{ color: "#F26212" }}>Get Started</span>?
      </Typography>
      <Typography variant="body1" paragraph sx={{ color: "#EDF2EF" }}>
        Join the tea party and start making your mark on the testnet. The open source revolution is here and you can be a part of it. We, here at PKGX, are super proud of the work we've done on tea, and we can't wait to hear your feedback.
      </Typography>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          href="https://tea.xyz"
          sx={{ textTransform: "none" }}
        >
          Get started on testnet
        </Button>
      </Stack>
    </Grid>

    {/* Right Column - Updated Image */}
    <Grid item xs={12} md={6}>
        <Box
            component="img"
            src="/imgs/pkgx-3d-glyphs.png"
            alt="PKGX 3D Glyphs"
            sx={{
            width: "100%",
            height: "auto",
            borderRadius: "8px"
            }}
        />
        </Grid>

    </Grid>
    </Container>

    </Box>
  );
};

export default TeaProtocol;
