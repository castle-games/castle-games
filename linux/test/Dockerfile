FROM amazonlinux:latest

WORKDIR /app

RUN yum -y install java python-pip
RUN pip install awscli --upgrade --user
RUN echo "PATH=~/.local/bin/:$PATH" > ~/.bashrc && source ~/.bashrc && aws configure set default.region us-west-2 && aws configure set aws_access_key_id default_access_key && aws configure set aws_secret_access_key default_secret_key

# These are needed for awscli https://github.com/aws/aws-cli/issues/1957
RUN yum install -y groff less