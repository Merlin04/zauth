#!/usr/bin/python3
import crypt
from hmac import compare_digest as compare_hash
import sys
import argparse

def check_password(user, passwd):
    with open("/etc/shadow") as f:
        content = f.read().splitlines()
    line = [x for x in content if x.split(":")[0] == user][0].split(":")[1]
    algAndSaltEnd = getAlgAndSaltEnd(line)
    algAndSalt = line[:algAndSaltEnd]
    newHash = crypt.crypt(passwd, algAndSalt)
    return compare_hash(newHash, line)

def getAlgAndSaltEnd(hash):
    dollars = 0
    for i in range(0, len(hash)):
        if(hash[i] == "$"):
            dollars += 1
        if(dollars == 3):
            return i

parser = argparse.ArgumentParser(description="Check a user's password")
parser.add_argument("user")
parser.add_argument("passwd")
args = parser.parse_args()

sys.exit(0 if check_password(args.user, args.passwd) else 1)