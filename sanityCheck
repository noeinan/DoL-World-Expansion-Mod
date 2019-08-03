#!/bin/bash
if [ ! -d ".git" ]; then
	#not running in git repo, so can't use git commands :-)
	echo "No .git repo found - skipping sanity checks"
	exit 0
fi

WARNING='\033[93m'
WARNING='\033[93m'
ENDC='\033[0m'

myprint() {
	while read data; do
		echo -n -e "[$1]$WARNING"
		echo "$data"
	done
}

GREP="git grep -n --color"
# Check for missing right angle bracket: <</if>
$GREP "<</[^>]*>[^>]" -- 'game/*'  | myprint "MissingClosingAngleBracket"
$GREP "<<[^>()]*>[^()<>"$'\r]*\r'"\?$" -- 'game/*' | myprint "MissingClosingAngleBracket"
# Check for missing left angle bracket: </if>>
$GREP "\([^<]\|^\)</\?\(if\|else\|case\|set\|print\|elseif\)" -- 'game/*' | myprint "MissingOpeningAngleBracket2"
# Check for accidental assignment.  e.g.:   <<if $foo = "hello">>
$GREP "<<[ ]*if[^>=]*[^><\!=]=[^=][^>]*>>" -- 'game/*' | myprint "AccidentalAssignmentInIf"
# Check for accidental assignment.  e.g.:   <<elseif $foo = "hello">>
$GREP "<<[ ]*elseif[^>=]*[^><\!=]=[^=][^>]*>>" -- 'game/*' | myprint "AccidentalAssignmentInElseIf"
# Check for missing ".  e.g.:   <<if $foo == "hello>>
# $GREP -e "<<[^\"<>]*\"[^\"<>]*>>" -- 'game/*' | myprint "MissingSpeechMark"
# Check for missing ".  e.g.:   <<if $foo = "hello)
# $GREP -e "<<[^\"<>]*\([^\"<>]*\"[^><\"]*\"\| [<>] \)*\"\([^\"<>]*\"[^><\"]*\"\| [<>] \)*\([^\"<>]\| [<>] \)*>>" --and --not -e "*[^']*" -- 'game/*' | myprint "MissingSpeechMark2"
# Check for colours like: @@color:red   - should be @@.red
$GREP -e "@@color:" --and --not -e  "@@color:rgb([0-9 ]\+,[0-9 ]\+,[0-9 ]\+)" -- "game/*" | myprint "UseCssColors"
# Check for missing $ in activeSlave or PC
$GREP "<<[ ]*[^\$><_\[]*\(activeSlave\|PC\)[.]"  -- "game/*" | myprint "MissingDollar"
# Check for closing bracket without opening bracket.  e.g.:  <<if foo)>>	  (but  <<case "foo")>>   is valid, so ignore those
$GREP -e "<<[ a-zA-Z]\+\([^()<>]\|[^()<>][<>][^()<>]\)*)" --and --not -e "<< *case"  -- "game/*" | myprint "MissingOpeningBracket"
# Check for opening bracket without closing bracket.  e.g.:  <<if (foo>>
$GREP -e "<<[ a-zA-Z]\([^<>]\|[^<>][<>][^<>]\)\+(\([^()<>]\|[^<>()][<>][^<>()]\|([^<>()]*])\)*>>" -- "game/*" | myprint "MissingClosingBracket"
# Check for two closing brackets but one opening bracket.  e.g.:  <<if (foo))>>
$GREP -e "<<[ a-zA-Z]\+[^()<>]*([^()]*)[^()]*)[^()<>]*>>"  -- "game/*" | myprint "MissingOpeningBracket2"
# Check for one closing bracket but two opening brackets.  e.g.:  <<if ((foo)>>
$GREP -e "<<[ a-zA-Z]\+[^()<>]*([^()]*([^()]*)[^()<>]*>>"  -- "game/*" | myprint "MissingClosingBracket2"
$GREP -e "<<.*[(][^<>)]*[(][^<>)]*)\?[^<>)]*>>" -- "game/*" | myprint "MissingClosingBracket3"
# Check for missing >>.  e.g.:   <<if $foo
$GREP "<<[^<>]*[^,\"\[{"$'\r]\r'"\?$" -- 'game/*' | myprint "MissingClosingAngleBrackets"
# Check for too many >>>.  e.g.: <</if>>>
$GREP "<<[^<>\"]*[<>]\?[^<>\"]*>>>" -- "game/*" | myprint "TooManyAngleBrackets"
# Check for too many <<<.  e.g.: <<</if>>
$GREP "<<<[^<>\"]*[<>]\?[^<>\"]*>>" -- "game/*" | myprint "TooManyAngleBrackets2"
# Check for wrong capitalisation on 'activeslave' and other common typos
$GREP  "\(csae\|[a-z] She \|attepmts\|youreslf\|advnaces\|canAcheive\|setBellySize\|SetbellySize\|setbellySize\|bellypreg\|pregBelly\|bellyimplant\|bellyfluid\|pronounCaps\|carress\)" -- 'game/*' | myprint "SpellCheck"
$GREP  "\(recieve\|recieves\)" -- 'game/*' | myprint "PregmodderCannotSpellReceive"
$GREP "\$slave\[" -- 'game/*' | myprint "ShouldBeSlaves"
# Check for strange spaces e.g.  $slaves[$i]. lips
$GREP "\$slaves\[\$i\]\. " -- 'game/*' | myprint "MissingPropertyAfterSlaves"
# Check, e.g., <<//if>>
$GREP "<</[a-zA-Z]*[^a-zA-Z<>]\+[a-zA-Z]*>>" -- 'game/*' | myprint "DoubleSlash"
# Check, e.g.  <<else $foo==4
$GREP "<<else >\?[^>]" -- 'game/*' | myprint "ShouldBeElseIf"
# Check, e.g., =to
$GREP "=to" -- 'game/*' | myprint "EqualAndTo"
# Check, e.g.  <<set foo == 4>>
$GREP "<<set[^{>=]*==" -- 'game/*' | myprint "DoubleEqualsInSet"
# Check for, e.g   <<if slaves[foo]>>
$GREP "<<\([^>]\|[^>]>[^>]\)*[^$]slaves\[" -- 'game/*' | myprint "MissingDollar"
# Check for missing $ or _ in variable name:
$GREP -e "<<[a-zA-Z]\([^>\"]\|[^>]>[^>]\|\"[^\"]*\"\)* [a-zA-Z]\+ * =" -- game/* | myprint "MissingDollar2"
# Check for missing command, e.g.  <<foo =
$GREP -e "<<[a-zA-Z]* = *" -- game/* | myprint "BadCommand"
# Check for duplicate words, e.g. with with
$GREP -e  " \(\b[a-zA-Z][a-zA-Z]\+\) \1\b " --and --not -e " her her " --and --not -e " you you " --and --not -e " New New " --and --not -e "Slave Slave " --and --not -e " that that " --and --not -e " in in " --and --not -e " is is " -- 'game/*' | myprint "Duplicate words"
# Check for obsolete SugarCube macros
$GREP -E "<<display |<<click|<<.*\.contains" -- game/* | myprint "ObsoleteMacro"
# Check for double articles
$GREP -E "\Wa an\W" -- game/* | myprint "DoubleArticle"
# Check for incorrect articles
$GREP -i -E "\Wa (a|e|i|o|u)." -- game/* | grep -a -i -vE "\Wa (un|eu|us|ut|on|ur|in)." | grep -a -i -vE "(&|<<s>>|UM)." | myprint "IncorrectArticle"
$GREP -i -E "\Wan (b|c|d|f|g|j|k|l|m|n|p|q|r|s|t|v|w|x|y|z)\w." -- game/* | grep -a -i -vE "[A-Z]{3}" | myprint "IncorrectArticle"
# Check for $ sign mid-word
$GREP -i "\w$\w" -- game/* | myprint "VarSignMidWord"
# check for $ sign at beginning of macro
$GREP '<<\s*\$' -- 'game/*'  | myprint "VarSignAtMacroStart"
# check for missing ; before statement
$GREP 'if $ ' -- 'game/*'  | myprint "missing ; before statement"
$GREP 'elseif $ ' -- 'game/*'  | myprint "missing ; before statement"
# Check that we do not have any variables that we use only once.   e.g.	 $onlyUsedOnce
# Ignore  *Nationalities
(
cd game/
find . -name "*.twee" -exec cat '{}' ';' | tr -c '$a-zA-Z' '\n'  | sed -n '/^[$]/p' | sort | uniq -u | sed 's/^[$]/-e[$]/' | sed 's/$/\\\\W/' | xargs -r  git grep -n --color | myprint "OnlyUsedOnce"
find . -name "*.twee" -exec cat '{}' ';' | tr -c '.$a-zA-Z[]_' '\n' | sed 's/SugarCube\.State\.variables\./$/g' | sed -n -e 's/^[$]\(PC\|activeSlave\|\(slaves\|tanks\)\[[^]]*\]*\)[.]\([a-zA-Z]\+\).*$/[.]\3/p' | sort | uniq -u |sed 's/^\(.*\)$/-e\1\\\\\b/'  | xargs -r git grep -n --color | myprint "SlaveAttributeUsedOnce"
$GREP "\$\(PC\|activeSlave\|slaves\|tanks\)[.][^a-zA-Z]" | myprint "UnexpectedCharAfterDot"

#Find all the variables listed in init.twee
VARIABLELIST=$(cat base-system/init.twee | tr -c '$a-zA-Z' '\n'  | sed -n '/^[$]/p' | sort | uniq)
# Find all variables anywhere.  Commented out because the output is too noisy currently
#VARIABLELIST=$(find . -name "*.twee" -exec cat '{}' ';' | tr -c '$a-zA-Z' '\n'  | sed -n '/^[$]/p' | sort | uniq)
MISSINGFROMVERSIONUPDATE=$(for variable in $VARIABLELIST; do grep -q "$variable" base-system/version-update.twee || echo "$variable"; done)
echo -e "base-system/version-update.twee$ENDC: $(echo $MISSINGFROMVERSIONUPDATE)" | myprint "MissingFromVersionUpdate"
)

git ls-files "game/*.twee" | xargs -d '\n'  ./devTools/check.py

