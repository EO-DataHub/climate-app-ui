#!/usr/bin/env python3
import os

import aws_cdk as cdk

from configs.prod import DEPLOY_PROJECT_CONFIG
from stacks.static_site import StaticSiteStack

app = cdk.App()
StaticSiteStack(
    app,
    f"{DEPLOY_PROJECT_CONFIG.project}-static-site",
    env=cdk.Environment(
        account=os.environ.get("CDK_DEPLOY_ACCOUNT", os.environ["CDK_DEFAULT_ACCOUNT"]),
        region=os.environ.get("CDK_DEPLOY_REGION", os.environ["CDK_DEFAULT_REGION"]),
    ),
    config=DEPLOY_PROJECT_CONFIG,
)

app.synth()
