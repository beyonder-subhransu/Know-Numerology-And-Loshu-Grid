const chaldeanChart = {
  A: 1, I: 1, J: 1, Q: 1, Y: 1,
  B: 2, K: 2, R: 2,
  C: 3, G: 3, L: 3, S: 3,
  D: 4, M: 4, T: 4,
  E: 5, H: 5, N: 5, X: 5,
  U: 6, V: 6, W: 6,
  O: 7, Z: 7,
  F: 8, P: 8
};

const vowels = ['A', 'E', 'I', 'O', 'U'];

const genderTraits = {
  male: "As a male, you are likely to express your numerology traits with assertiveness, logic, and outward confidence. You may be seen as a provider, protector, or leader, and your approach to challenges is often direct and action-oriented.",
  female: "As a female, you are likely to express your numerology traits with intuition, empathy, and nurturing qualities. You may be seen as a supporter, communicator, or harmonizer, and your approach to challenges is often collaborative and creative.",
  other: "You express your numerology traits in a unique and authentic way, blending qualities of assertiveness, empathy, creativity, and resilience. Your approach to life is individualistic, and you bring a fresh perspective to every situation."
};

function reduceToSingleDigit(num) {
  while (num > 9) {
    num = num.toString().split('').reduce((a, b) => a + Number(b), 0);
  }
  return num;
}

function calculateChaldeanNameNumbers(name) {
  let total = 0, vowelSum = 0, consonantSum = 0;
  for (let char of name) {
    const num = chaldeanChart[char];
    if (!num) continue; // skip spaces or unassigned chars
    total += num;
    if (vowels.includes(char)) vowelSum += num;
    else consonantSum += num;
  }
  return {
    expression: reduceToSingleDigit(total),
    soulUrge: reduceToSingleDigit(vowelSum),
    personality: reduceToSingleDigit(consonantSum)
    };
  }

  const meanings = {
    1: "Independent, leader, ambitious, determined.",
    2: "Peacemaker, sensitive, cooperative, gentle.",
    3: "Creative, expressive, joyful, sociable.",
    4: "Practical, hardworking, disciplined, stable.",
    5: "Adventurous, free spirit, dynamic, quick-witted.",
    6: "Caring, responsible, nurturing, artistic.",
    7: "Spiritual, analytical, intuitive, deep thinker.",
    8: "Ambitious, authoritative, powerful, material success.",
    9: "Humanitarian, compassionate, emotional, wise."
  };

  const numberCompatibility = {
1: { friendly: [1,2,3,5,6,9], enemy: [8], neutral: [4,7], lifePartners: [2,3,6] },
2: { friendly: [1,2,3,5], enemy: [8,4,9], neutral: [7,6], lifePartners: [1,3,5] },
3: { friendly: [1,2,3,5,7], enemy: [6], neutral: [4,8,9], lifePartners: [5,9] },
4: { friendly: [1,5,7,6,8], enemy: [2,9,4,8], neutral: [3], lifePartners: [1,6,7] },
5: { friendly: [1,2,3,5,6], enemy: [], neutral: [4,7,8,9], lifePartners: [1,3,6] },
6: { friendly: [1,4,5,6,7,8,9], enemy: [3], neutral: [2], lifePartners: [1,5,6,8,9] },
7: { friendly: [1,3,4,5,6], enemy: [2], neutral: [8,2,9], lifePartners: [3,4,6] },
8: { friendly: [5,6,3,7], enemy: [1,2,4,8], neutral: [9], lifePartners: [5,6,3,7] },
9: { friendly: [1,5,6,3], enemy: [4,2], neutral: [9,7,8], lifePartners: [3,5,6] }
};

function getFullCompatibility(number, label = "Number") {
const data = numberCompatibility[number];
if (!data) return `<p>${label} (${number}) – Compatibility data not found.</p>`;

return `
  <p><strong>🔸 ${label} (${number}) Compatibility:</strong></p>
  <ul>
    <li><strong>🤝 Friendly With:</strong> ${data.friendly.join(', ') || 'None'}</li>
    <li><strong>⚠️ Enemy With:</strong> ${data.enemy.join(', ') || 'None'}</li>
    <li><strong>💞 Ideal Life Partners:</strong> ${data.lifePartners.join(', ') || 'None'}</li>
    <li><strong>😐 Neutral With:</strong> ${data.neutral.join(', ') || 'None'}</li>
  </ul>
`;
}

function getDriverConductorFromDOB(dob) {
const date = new Date(dob);
const d = date.getDate();
const m = date.getMonth() + 1;
const y = date.getFullYear();

const driver = reduceToSingleDigit(d);
const conductor = reduceToSingleDigit(d + m + y);

return { driver, conductor };
}

function checkPartnerCompatibility() {
const dob = document.getElementById("partnerDOB").value;
const partnerName = document.getElementById("partnerName").value;
if (!dob || !partnerName) return;

// Get user's numbers from lastResult (from main form)
const { driver, conductor } = lastResult;
const { driver: pDriver, conductor: pConductor } = getDriverConductorFromDOB(dob);

// Life partner compatibility logic
function getLifePartnerLabel(userNum, partnerNum) {
  const lp = numberCompatibility[userNum]?.lifePartners || [];
  if (lp.includes(partnerNum)) return '<span style="color:green;font-weight:bold;">Perfect Match</span>';
  if ((numberCompatibility[userNum]?.friendly || []).includes(partnerNum)) return '<span style="color:blue;">Good Match</span>';
  if ((numberCompatibility[userNum]?.enemy || []).includes(partnerNum)) return '<span style="color:red;">Not a Good Match</span>';
  return '<span style="color:gray;">Neutral</span>';
}

let partnerInterp = driverConductorInterpretations[`${pDriver}-${pConductor}`]
  ? `<h5>🔎 Partner Driver-Conductor Pair Interpretation</h5><div style='background:#f8f9fa;padding:12px;border-radius:8px;margin-bottom:10px;'>${driverConductorInterpretations[`${pDriver}-${pConductor}`].replace(/\n/g, '<br>')}</div>`
  : '';
let comparison = `<h5>🔗 Comparison</h5><div style='background:#fffbe6;padding:12px;border-radius:8px;'>
  <b>Your Pair:</b> Driver ${driver} & Conductor ${conductor}<br>
  <b>Partner Pair:</b> Driver ${pDriver} & Conductor ${pConductor}<br>
  <b>Driver Match:</b> ${compareNumbers(driver, pDriver)} (${getLifePartnerLabel(driver, pDriver)})<br>
  <b>Conductor Match:</b> ${compareNumbers(conductor, pConductor)} (${getLifePartnerLabel(conductor, pConductor)})
</div>`;
document.getElementById('partnerResult').innerHTML = partnerInterp + comparison;
}

function compareNumbers(n1, n2) {
if (numberCompatibility[n1].friendly.includes(n2)) return "🤝 Friendly";
if (numberCompatibility[n1].enemy.includes(n2)) return "⚠️ Enemy";
if (numberCompatibility[n1].lifePartners.includes(n2)) return "💞 Ideal Match";
return "😐 Neutral";
}

  const colorZodiacSuggestions = {
    1: { color: "Red", trait: "Bold, independent leader" },
    2: { color: "White", trait: "Gentle and peace-loving" },
    3: { color: "Yellow", trait: "Creative and cheerful" },
    4: { color: "Blue", trait: "Stable, practical, grounded" },
    5: { color: "Green", trait: "Adventurous and free-spirited" },
    6: { color: "Pink", trait: "Loving and nurturing" },
    7: { color: "Purple", trait: "Mystical and analytical" },
    8: { color: "Black", trait: "Strong and authoritative" },
    9: { color: "Gold", trait: "Compassionate and noble" },
   11: { color: "Silver", trait: "Intuitive and visionary" },
   22: { color: "Indigo", trait: "Masterful and purposeful" },
   33: { color: "Aqua", trait: "Empathetic and selfless" }
  };

  let lastResult = {};

  // Add detailed interpretations for Driver-Conductor pairs
  const driverConductorInterpretations = {
    '1-1': `The Reign of Two Kings\n\nWhen both the Driver and Conductor happen to be 1, they form an unmatched leadership/authority alignment. This combination is rare and strong - two kings rule, their ambition and confidence amping up.\n\nRelationships: Passionate and intense. These individuals often form powerful bonds but may struggle with dominance issues. Mutual respect is essential to avoid ego clashes. If managed, this pair becomes an unstoppable force in love and life.\n\nChallenges: The double leadership sometimes creates conflict if ego clashes occur. However, often their strong will overrules the petty differences.\n\nCareer Path: This combination thrives at business, politics, and any other field requiring the leadership of a person. Entrepreneurs, CEOs, and leaders in any creative industries often have this pairing.\n\n"When two kings unite, destiny bends to their will."`,
    '1-2': `The King and the Queen\n\nIn combining the active, aspiring personality of a Number 1 and intuitive, caring nature of Number 2, it sets a balance between power and sensitivity. It is one of the most harmonious combinations where the King (1) leads and the Queen (2) follows graciously.\n\nRelationships: Deeply harmonious and romantic. Number 1 brings strength, while Number 2 offers emotional depth. This makes for a balanced and affectionate bond where both partners feel valued and supported.\n\nChallenges: Overdependence on the supportive nature of Number 2 can lead to indecision at times, particularly if the individual doesn't assert their own authority.\n\nCareer Paths: Ideal professions include fields involving water (such as the Navy), education, counseling, or healing professions like nursing or therapy.\n\n"The King leads the way, but the Queen ensures the journey is smooth."`,
    '1-3': `The King and Jupiter\n\nNumber 1's leadership qualities couple with the expansive wisdom of Number 3, which is ruled by Jupiter. This combination indicates intellectual development, creativity, and a skill for leading others.\n\nRelationships: Energetic and intellectually stimulating. Both partners inspire each other and keep life lively. However, they must take care not to compete intellectually or dominate conversations.\n\nChallenges: Their high intellect can make them overly critical or impatient with those who do not have the same level of thinking.\n\nCareer Paths: Education, consultancy, writing, and public speaking are all good options. They tend to be great mentors or spiritual guides.\n\n"Knowledge lights the path for the King."`,
    '1-4': `The King and the Gangster\n\nIt is a combination of Number 1's regal energy with Number 4's rebellious and unpredictable vibes. The result is a unique mix of creativity and strategy.\n\nRelationships: Unconventional and exciting. This pair thrives on challenge and intensity. Stability may be an issue, but the chemistry is undeniable. A dynamic duo that either transforms or self-destructs.\n\nChallenges: Such nature may lead to unstable circumstances if not handled in proper management.\n\nCareer Paths: Suitable places include politics, speculative venture, and entrepreneurial projects related to the most unconventional of industries.\n\n"When the rogue unites with the king, innovation strikes."`,
    '1-5': `The King and the Prince\n\nThis one brings together Number 1's tenacity with a dash of the flexibility, charm, and adaptability of Number 5. It is energetic and nimble and very likely a winning combination.\n\nRelationships: Playful and adventurous. These two enjoy life, travel, and exploration together. They need freedom and variety, so commitment only thrives with mutual trust and independence.\n\nChallenges: Their ambitious drive may sometime clash with their desire for freedom and spontaneity, leaving them unfocused.\n\nCareer Paths: Banking, finance, sales, and commerce suit them. They also flourish in areas that require communication with the public and skills in negotiation.\n\n"The King and the Prince conquer every arena with their synergy."`,
    '1-6': `The King and Venus\n\nThe majesty of Number 1 blends with the grace and beauty of Number 6, ruled by Venus. This produces a creative and harmonious individual with a keen eye for aesthetics.\n\nRelationships: Romantic and loving. This is a tender yet strong pair. The King leads with confidence, while Venus nurtures with affection. Love, family, and home life are well-balanced.\n\nChallenges: Their concern for aesthetics and harmony may sometimes lead them to lose track of practical goals.\n\nCareer Paths: Media, entertainment, hospitality, travel, and luxury industries like jewelry, liquor, or high-end fashion suit them well.\n\n"The King rules with charm and elegance."`,
    '1-7': `The King and Ketu\n\nThis combination combines the leadership aspect of Number 1 with the introspective and spiritual energy of Number 7. It produces a reflective, mystical personality who is quite inclined towards spirituality or research.\n\nRelationships: Deep and spiritual. The bond often feels fated. However, emotional detachment from one or both sides can create distance. Needs emotional openness and patience.\n\nChallenges: They may face problems of isolation, self-doubt, and the inability to express emotions. Their journey to success is often through overcoming inner conflicts.\n\nCareer Paths: Education, research, spirituality, and occult sciences are ideal for them.\n\n"The King embarks on a spiritual quest."`,
    '1-8': `The King and Saturn\n\nNumber 1 and Number 8 energies are highly contrasting; they create tension and often struggle. Number 1 is ambitious and optimistic while Number 8 brings in heaviness, delays, and obstacles.\n\nRelationships: Intense and karmic. Often tested by time and circumstance. Loyalty and shared hardship bind them deeply, but power struggles and emotional coldness can cause friction.\n\nChallenges: Delays, misunderstandings, and a lack of harmony are common. Balancing these energies requires patience and resilience.\n\nCareer Paths: Success is possible in industries involving hard work, such as manufacturing, construction, or law enforcement.\n\n"The King battles with Saturn's trials."`,
    '1-9': `The King and Mars\n\nThe most powerful combination is when the sun (1) and the mars (9) combined, making it an unbearable energy that cannot be stood against. It symbolises unmatched success and ambition.\n\nRelationships: Fiery and passionate. This couple ignites instantly with chemistry and shared ambition. If egos are kept in check, they can build empires together.\n\nChallenges: This combination can be very impatient or impulsive sometimes, but that is minor in comparison to their potential.\n\nCareer Paths: They do great in fields that need leadership, strategy, and action. Business, politics, and defense are good fields.\n\n"The King and the Warrior forge a legacy of triumph."`,
    '2-1': `Moon and Sun\n\nIt is one of the nice combinations involving the sensitivity of the moon with the self-confidence, charisma, and outgoing nature of the sun. People of this combination are balanced with an optimistic attitude, driven for success, and natural leadership with a strong emotional background.\n\nRelationships: With all that emotional depth and charisma, they are very caring and attentive partners. They thrive well in relationships where mutual respect and admiration are present. However, sometimes they can be over-analytical to the point of misunderstanding a situation at times.\n\nCareer Path: This combination fits careers that require leadership, creativity, and public engagement. Ideal professions include entertainment, politics, business, public speaking, or teaching.\n\nChallenges: While their confidence moves them to success, they are sometimes overcome with self-doubt when they feel low. They need self-discipline and emotional equilibrium.`,
    '2-2': `Double Moon\n\nMoon in both the driver and conductor positions intensifies sensitivity and intuition. However, the double effect can render individuals indecisive and overthinking.\n\nRelationships: These people are caring and sensitive partners, who are also very emotional. They live in a world of sensitivity and feelings. However, their unstable minds can lead to problems in communication and decision-making in relationships.\n\nCareer Path: They find success in careers that require a lot of emotional intelligence and creativity, such as counseling, writing, hospitality, or careers associated with water or dairy industries.\n\nChallenges: Their main challenges come from indecisiveness and problems with multi-tasking. They will struggle with handling complicated circumstances, thus often missing their opportunities.`,
    '2-3': `Moon and Jupiter\n\nIn this combination, the energy of the Moon is integrated with Jupiter's wisdom and expanse. Although this conjunction is not a naturally harmonic one, it does show potential for success in the intellectual and spiritual fields.\n\nRelationships: They are thoughtful and philosophical in relationships, and they value meaningful conversations and emotional depth. However, they tend to overanalyze situations, which creates misunderstandings with their partners.\n\nCareer Path: They are best suited for roles in education, research, teaching, or spiritual practices. They thrive in environments that encourage knowledge sharing and intellectual growth.\n\nChallenges: They may not find stability early in life because they need a lot of effort to balance emotional sensitivity with practical decision-making.`,
    '2-4': `Moon and Rahu\n\nThe combination of the Moon and Rahu creates an intense, unpredictable dynamic. Rahu amplifies the Moon's emotional tendencies, resulting in heightened sensitivity, overthinking, and fluctuating life circumstances. This is often considered a challenging pairing, as it brings periods of instability and confusion. However, it also offers the potential for profound growth through self-awareness and spiritual exploration.\n\nRelationships: Relationships are complex for individuals with this combination. They may experience emotional highs and lows, making it difficult for them to maintain steady connections. Rahu's influence can create misunderstandings or trust issues in partnerships. However, when they develop emotional balance, they can be deeply empathetic and devoted partners.\n\nCareer Path: Rahu's influence makes these individuals drawn to unconventional or modern fields. They may succeed in technology, media, marketing, aviation, or professions involving foreign travel. Their innovative thinking and desire to break boundaries give them an edge in competitive environments.\n\nChallenges: Emotional instability and confusion often plague these individuals, leading to indecision or impulsive choices. They may also struggle with unrealistic expectations or obsessive tendencies. Managing these emotions and grounding themselves is critical for achieving success.`,
    '2-5': `Moon and Mercury\n\nThis is known as the "mother-son combination," one of the most favorable pairings. The nurturing quality of the Moon complements Mercury's intellectual agility, hence creating a dynamic and effective personality.\n\nRelationships: Communicative and adaptable are these people, hence make very interesting partners. Harmonious, they love the art of using charm and wit to solve problems in their relationships.\n\nCareer path: Ideal fields include banking, finance, real estate, sales, and marketing. Their adaptability, coupled with communication skills, shines here.\n\nChallenges: They can sometimes overcommit and become stressed or burned out. Keeping focused without letting unnecessary distractions blur that focus is important.`,
    '2-6': `Moon and Venus\n\nThis combination will place the emotional depth of the Moon with the love for luxury and beauty by Venus. It's not exactly harmonious, but it can lead to middle-class success and a life of glamour.\n\nRelationships: These people are romantic and attached to their lovers. However, their material comfort needs can sometimes be at odds if not balanced with emotional needs.\n\nCareer Path: They are great in fashion, media, hospitality, tourism, or the sweet business (which symbolizes the Moon's milk and Venus's celebratory nature). They are unique in their creativity and aesthetic sense.\n\nChallenges: Overindulgence in luxury or material pursuits can prove to be financially unstable. They are successful if they have a balance between emotional needs and material goals.`,
    '2-7': `Moon and Ketu\n\nIt is both challenging and an exceptional potential combination. Despite material success, they seem to be very intuitive with spiritual insight.\n\nRelationships: Relationships can be problematic because of emotional ups and downs. They may not clearly express their feelings, leading to misunderstandings with their partners.\n\nCareer Path: Fields like astrology, numerology, psychology, research, or alternative healing are perfect. Their sharp intuition and interest make them natural investigators or mystics.\n\nChallenges: Their dependence on intuition makes them unpredictable in their decision-making. They need to build structure and consistency in their lives.`,
    '2-8': `Moon-Saturn\n\nThis combination usually faces many challenges because the emotional nature of the Moon clashes with the disciplined and restrictive energy of Saturn. Success only comes after much effort and perseverance.\n\nRelationships: Emotional tension can destroy relationships, because they don't have a healthy way to express themselves. They need very patient and understanding partners in their life.\n\nCareer path: Lawyers, technological experts, administrative personnel or metallurgists are given success in step by step process. They excel very well in a formal work environment.\n\nChallenges: The problems occur both in professional and personal areas of the lives and suffer from mental boredom. The development of mindfulness and emotional toughness is absolutely necessary.`,
    '2-9': `Moon and Mars\n\nThis is one of the most challenging pairings because nurturing Moon and aggressive Mars inherently oppose each other, leading to turbulence and conflict emotionally.\n\nRelationships: Relationships often tend to be marked with misunderstandings and power struggles. Their fiery temper can become unstable unless balanced with patience and self-awareness.\n\nCareer Path: Success may come in competitive or high-energy professions like defense, law enforcement, competitive sports, or entrepreneurship. Their drive and assertiveness make them effective in challenging roles.\n\nChallenges: Emotional volatility and failure to manage conflicts can undermine personal and professional growth. Emotional intelligence and mindfulness practices are essential.`,

    // 3-x
    '3-1': `Jupiter and Sun\n\nThis is a powerful combination where Jupiter, the good teacher, forms a union with the Sun, the leader. They form individuals who are disciplined, optimistic, and goal-directed. They are natural leaders with a sense of direction.\n\nRelationships: Loyal and generous, they cherish relationships based on mutual respect. They are very caring; however, their authoritative nature might overpower personal dynamics.\n\nCareer Path: This mix is excellent for education, politics, healing occupations, administrative roles, and even the occult sciences. Their magnetism and intelligence make them powerful leaders and influencers.\n\nChallenges: Over-confidence and intransigence and failure to work collaboratively can become bottlenecks to their achievement. They can acquire humility and team spirit to better themselves.`,
    '3-2': `Jupiter and Moon\n\nJupiter's wisdom joins forces with the Moon's emotional profundity, and the resulting person is well-balanced and empathetic. Although they may not excel at leadership, they are stellar collaborators and troubleshooters.\n\nRelationships: Empathetic and sensitive, they're caretakers of those they love and are frequently supportive partners. Yet their emotional tendencies tend to cause them to overanalyze or become hesitant.\n\nCareer Path: These individuals are good at education, milk industries, water works careers and hospitality. Their intuition also prepares them for a victory in counseling and coaching\n\nWeaknesses: They become emotionally unstable and make decisions based too much on emotions. They must learn to be logical thinkers to balance out the emotion.`,
    '3-3': `Double Jupiter\n\nDouble Jupiter placement adds more to the intellect of wisdom, knowledge, and spirituality. The individual is a visionary and an insatiable learner. However, with this combination, there usually happens to be strife in putting into practice the ideas.\n\nRelationships: They are loving and nurturant partners but appear distant because they are too absorbed in their intellectual world. The ideal partner should be one who is intellectually aware of their needs.\n\nCareer Path: Ideal places of work would be education, lecturership, stationery shop or any other business, occult study, and any student-life events. They are just great for work where they get to teach other people.\n\nWeaknesses: They like to take over more than one project simultaneously, which results in burnout. Great initiators but bad on completion, thereby making long-term success an issue`,
    '3-4': `Jupiter and Rahu\n\nThis dynamic blend unites wise Jupiter with ambitious, materialistic Rahu. While Rahu admires Jupiter, shared lack of alignment becomes painful, and the combination is effortful but certainly worth it.\n\nRelationships: It can be challenging in their personal life because the unbalanced energy of Rahu can cause misunderstandings among them. They need to communicate freely with one another to establish trust in relationships.\n\nCareer Path: They are good at sales, marketing, judiciary, and public relation sectors. They are flexible and innovative thinkers, so they excel in competitive and innovative fields.\n\nChallenges: It is difficult to keep ethics intact with the materialistic effect of Rahu. They should remain grounded to avoid being influenced by ambition.`,
    '3-5': `Jupiter and Mercury\n\nThis harmonious blend carries Jupiter's wisdom and Mercury's communication skills. They are often referred to as the Guru and the Prince, which makes for very flexible, innovative, and successful individuals.\n\nRelationships: They are friendly and eloquent and prioritize intellectual as well as emotional bonding. They succeed in partnerships that promote personal as well as professional development.\n\nCareer Path: They excel in media, voice-overs, banking, finance, and creative fields. Their excellent communication skills qualify them for public relations roles or behind-scenes creative work.\n\nChallenges: Dependence on intellect at times can make them emotionally detached. They need to develop empathy and concentration on emotional depth to achieve a balance.`,
    '3-6': `Jupiter and Venus\n\nJupiter and Venus are natural adversaries, and this combination will be tense. Jupiter is spiritual wisdom-oriented and Venus is material pleasure indulgent, which will have opposing motivations.\n\nRelationships: Marital compatibility will be difficult for this combination. Venus's love of luxury and Jupiter's sense of morality can trigger strain in personal relationships.\n\nCareer Path: Even with adversity, they can succeed in artistic pursuits like arts, luxury, or fashion. With diligence and determination, they can overcome hindrances to gain stability.\n\nChallenges: Poor health and inconsistency can hold them back. Cultivating self-discipline and mindfulness can assist them to stay focused.`,
    '3-7': `Jupiter and Ketu\n\nThis spiritual mix will lead to extremely philosophical and intuitive individuals with Jupiter's wisdom and Ketu's detachment, though they may not find material success with ease; intellectual and spiritual profundity has no equal.\n\nRelationship: Emotionally deep and meaningful relationships are the most important thing to them, though emotional expression is a little difficult. Trust establishment and good communication are what make those relationships last.\n\nCareer Path: They excel in education, administrative services, occult sciences, and healing professions. Their analytical mind and wisdom make them suitable for the job that requires strategic thinking and problem-solving.\n\nChallenges: Ketu's influence may cause a lack of focus or attachment to worldly matters. They need to develop practical skills to achieve success in tangible ways.`,
    '3-8': `Jupiter and Saturn\n\nThis blend of energy creates Jupiter's wisdom and Saturn's discipline. The outcome is a mixture between challenge and opportunity.\n\nRelationships: They are stable and practical partners but at times are not so self-assured in expressing their feelings. Stable and empathetic relationships assist them in thriving.\n\nCareer Path: The most suited careers would be for such careers as law, education, administrative services, or printing. Their disciplinary nature and awareness render them to fit into organized fields.\n\nChallenges: They face hindrances and tardiness in reaching their targets. Building persistence and continuity assists them in overcoming the challenges they encounter.`,
    '3-9': `Jupiter and Mars\n\nThis is a blend of Jupiter's intelligence and Mars's aggressiveness that creates individuals who are highly focused, active, and objective. Although it is not the most dominant, it equates brains with action.\n\nRelationships: They are ardent and faithful lovers, but there may be too much arguing as a result of Mars's fiery nature. Harmony has to be patiently and compassionately sought.\n\nCareer Path: They excel in dynamic careers, including defense, law enforcement, administrative positions, or very competitive business. They possess a sense of leadership and determination.\n\nChallenges: They are emotionally unstable and impulsive. If they are able to control themselves and become patient, then they will surely achieve their goals.`,

    // 4-x
    '4-1': `Rahu and Sun\n\nThis is one of the strongest pairings for driver number 4. Rahu's disruptive nature is balanced by the Sun's leadership abilities. Together, they form individuals who are driven, confident, and set on becoming great.\n\nRelationships: They are fiercely loyal and expect respect in relationships. But their controlling and bossy nature can create tension if not checked.\n\nCareer Path: This blend is best suited for political, business, and entrepreneurial pursuits. Born leaders, they perform well in high-pressure situations and can bring tremendous success by planning and taking risks.\n\nChallenges: Overconfidence and over overlooking of details could be disadvantages. In order to be successful in the long run, humility and patience need to be learned.`,
    '4-2': `Rahu and Moon\n\nThis pairing is a conflict between the high energy of Rahu and the emotional sensitivity of the Moon. The life becomes full of inner battles and conflicts, and despairing moments are quite frequent.\n\nRelationships: These people are emotionally unstable, insecure, and mood-swingers. Such types of people cause difficulties in personal relationships. They require understanding partners who can stabilize them.\n\nCareer Path: Careers in counseling, nursing, or creative fields can be an outlet for their emotional depth. Water-related professions or industries like hospitality may also suit them.\n\nChallenges: Depression and emotional instability are significant hurdles. Regular meditation and seeking balance through mindfulness are crucial for overcoming these challenges.`,
    '4-3': `Rahu and Jupiter\n\nRahu's waywardness gets balanced by Jupiter's intelligence and wisdom to create useful and creative individuals. The focus in this case is on flexibility and creativity thinking.\n\nRelationships: They prefer mental compatibility in relationships. Even though they remain committed, they fail to convey their emotions. This can lead to misunderstandings.\n\nCareer Path: They are excellent for marketing, teaching, and any form of job in the education industry. Their persuasive nature and creativity make them great at connecting with people.\n\nChallenges: Burnout is caused by overanalysis or overcommitting. It is necessary to concentrate on one objective at a time to be successful.`,
    '4-4': `Double Rahu\n\nIf Rahu occupies both the driver's and conductor's seats, such a life would be extreme and erratic with constant struggles, accidents, and falls. However, they will never give up and come back.\n\nRelationships: Intimate relationships can become stormy because of the unstable nature of Rahu. Trust issues and differences are very common, but open conversation can actually help clear things up.\n\nCareer Path: Sales, marketing, business, and law professions are most suitable. They excel in competitive and stressful situations due to their tendency to think outside the box.\n\nChallenges: Persistent struggle is the sign of this combination. Keeping going and getting help through guidance by mentors or counselors can help them overcome life's challenges.`,
    '4-5': `Rahu and Mercury\n\nRahu's courage complements Mercury's intelligence and communication abilities, making for a dynamic and flexible person. This blend is renowned for being witty, charming, and functioning well under stress.\n\nRelationships: They are charming and sociable and thus become popular people. But at times, their overthinking nature causes tension in relationships.\n\nCareer Path: Professions in media, banking, finance, and communication sectors are best suited. They are best suited for jobs that demand quick thinking and flexibility.\n\nChallenges: Restlessness and lack of concentration can be a stumbling block to long-term achievement. They must acquire discipline and clear objectives for their development.`,
    '4-6': `Rahu and Venus\n\nThis is a pleasant pairing because Rahu and Venus equally love luxury, glamour, and excess. This pairing produces charming, creative, and materialistic goal-getting individuals.\n\nRelationships: Romantic and passionate but not committed since they crave excitement and variety.\n\nCareer Path: Media, entertainment, law, liquor, and luxury industries such as casinos, pubs, or the fashion business. They will certainly excel in creative and high-profile professional lives.\n\nChallenges: Excess indulgence in material luxuries creates financial or personal insecurity. They need moderation to maintain themselves.`,
    '4-7': `Rahu and Ketu\n\nThis is the most equilibriated mixture, with the conjunction of Rahu (body) and Ketu (head). They are intuitive, wise, and powerful.\n\nRelationships: They are reflective and religious in their nature, thus appear distant. However, they do enjoy profound and meaningful relationships, but these are rooted in mutual comprehension.\n\nCareer Line: They are very good in occult sciences, education, healing occupations, and administration. They are most suitable for research-based careers because they have an analytical mind and spiritual insight.\n\nWeaknesses: They have retarded success and internal strife. For their success, they require patience and persistence.`,
    '4-8': `Rahu and Saturn\n\nThis is the union of two planets of strife. A life is thereby fraught with strife, but they possess the colossal capacity to survive against all odds and to conquer them by sheer will power.\n\nRelationship: Their relationships are susceptible to misunderstandings and disagreement. One who can be a supporting partner who feels their plight is required.\n\nCareer Path: They are suitable for legal, defense, police, and administrative services. They excel in disciplined environments and never lose heart.\n\nChallenges: Medical problems and constant setbacks are frustrating at times. Maintaining a positive attitude and learning solutions to overcome through spiritual or professional advice will enable them to solve problems.`,
    '4-9': `Rahu and Mars\n\nThis blend is intense and combative because Rahu's rebellious nature is combined with Mars's aggressive nature. These are ambitious people who have plenty of strife in their path.\n\nRelationships: Their volatile temperament causes relationship problems. They need to master patience and give-and-take to bring harmony.\n\nCareer Path: They excel in defense, law enforcement, competitive business settings, and high-pressure careers. They excel in risky lines of work due to their drive and daring nature.\n\nChallenges: They are accident-prone and under the knife and often sick. Self-care routines and awareness are required for them.`,

    // 5-x
    '5-1': `Mercury and Sun The Charismatic Leader\n\nThis is a highly energetic personality that results from Mercury and the Sun combination. Individuals with this combination are charismatic, self-assured, and natural-born leaders. Their intelligence coupled with the Sun's commanding power makes them decisive, creative, and compelled to excel.\n\nRelationships: They are loving, affectionate, and supportive partners. At times, their assertive nature also comes across as dominating. To be in harmony, they have to learn to exercise patience and give their partners equal access to the relationship.\n\nCareer Path: These people excel as leaders who demand strategic planning and strong communication skills. Business, politics, management, and education are best fields for them where they can harness their abilities to inspire and guide others.\n\nChallenges: This combination's overconfidence and impulsive decision making are common pitfalls. Their full potential will be attained by developing humility and a sense of learning to know situations well before acting.`,
    '5-2': `Mercury and Moon The Compassionate Pragmatist\n\nThe blending of Mercury's rationality with the emotional depth of the Moon results in a well-rounded personality that is both practical and empathetic. This "mother-and-son" blend creates a nurturing energy that allows these people to harmonize logic and feelings in a great way.\n\nRelationships: They are empathetic and caring partners who value relationships and family. Sensitive as they are, they tend to indulge in indecision or struggle to assert themselves at times.\n\nCareer Path: Professions like real estate, property management, hospitality, and caregiving are appropriate for this combination. Their capacity to connect on an intimate level assures success in these fields.\n\nChallenges: They are likely to suffer from mood swings and excessive thinking. Building their focus and judgment will assist them in addressing such challenges.`,
    '5-3': `Mercury and Jupiter The Wise Communicator\n\nThis blend unites Mercury's ability to communicate with Jupiter's expansiveness and wisdom. These are people who are inherently convincing and are masters at establishing intimate relationships. They are knowledgeable and have an appetite for learning and intellectual pursuits.\n\nRelationships: Loyalty and mental stimulation are the keys to their relationships. Though they are faithful lovers, their overthinking nature can create misunderstandings if not handled well.\n\nCareer Path: Education, media, banking and interior designers are suitable for this mix. This is due to the fact that this combination provides them with the correct words and communication skills to deal with public participation professions.\n\nChallenges: Overreaching could ultimately lead to burnout. Educating individuals to abandon attempting to do everything at a time enables them to be balanced and concentrate.`,
    '5-4': `Mercury and Rahu - The Ambitious Trailblazer\n\nA mix of Mercury's wisdom and Rahu's ambition, this combination is characterized by tenacity and perseverance. Rahu's influence tends to postpone success, though, and these people must work through difficulties.\n\nRelationships: They tend to be volatile and can have difficulty with long-term relationships. Establishing trust and practicing open, honest communication are necessary for healthy relations to be maintained.\n\nCareer Path: The most prevailing careers in this combination would be sales, marketing, and law, since these careers deploy the resourceful and persistent nature of individuals.\n\nChallenges: Anticipate delays and setbacks, but with persistence and steadiness, they will get over these circumstances and achieve their goals.`,
    '5-5': `Double Mercury The Intellectual Visionary\n\nWhen Mercury is governing the driver as well as the conductor numbers, it enhances the qualities of intelligence, creativity, and adaptability. This combination, however, also generates indolence and procrastination, which blocks progress.\n\nRelationships: Such individuals look for intellectual rapport in relationships but prove to be unfaithful because of their unruly temperament. Proper communication and respect help them preserve harmony.\n\nCareer Path: They fit best into careers that require innovative thinking and problem-solving, including entrepreneurship, education, research, and communications.\n\nChallenges: They have to avoid laziness and work in a more organized manner. Setting high targets and meeting deadlines may also help them move ahead without getting deterred.`,
    '5-6': `Mercury and Venus The Creative Achiever\n\nMercury's sense of wisdom tastefully mixes with Venus' charm and affection for life's comforts to create an artistic yet well-balanced personality. They are usually drawn to beautiful and successful careers where they can utilize their creative abilities.\n\nRelationships: They adore romance and emotional passion but sometimes push their relationships to the limits of material prosperity if not accompanied with personal values.\n\nCareer Path: Luxury hospitality, media, entertainment, and travel are the right industry domains for such an association. Their sobriety and flamboyance enable them to excel in these areas.\n\nChallenges: Over indulgence in luxury may put one in fiscal instability. The ability to keep ambition in check with sobriety is a necessary domain.`,
    '5-7': `Mercury and Ketu -The Intellectual Mystic\n\nThis combination marries the curiosity of Mercury with the spiritual profundity of Ketu, and thus the people become introspective and extremely analytical. They tend to be attracted to intellectual and philosophical interests. \n\nRelationships: These people might find it difficult to communicate their emotions but do well in understanding-based and mentally compatible relationships.\n\nCareer Path: They are well-suited in research, computer science, teaching, and occult sciences where their problem-solving and analytical abilities are put to high use.\n\nChallenges: Procrastinated success and self-doubting are two frequent challenges. The primary solution to overcoming such challenges lies in gaining confidence and keeping a level head regarding what they desire.`,
    '5-8': `Mercury and Saturn The Disciplined Strategist\n\nMercury's flexibility coupled with Saturn's discipline yields very practical, goal-oriented individuals who are consumed with achieving success. \n\nRelationships: They crave stability and loyalty but struggle to express their feelings. Their ideal partner, one who knows them, will discover that they are very reliable.\n\nCareer Path: Real estate, finance, law, and administrative professions suit this combination. Their systematic and disciplined approach ensures success in these fields.\n\nChallenges: Burnout is likely due to overworking and stress. Work-life balance and self-care are extremely crucial.`,
    '5-9': `Mercury and Mars The Action-Oriented Visionary\n\nMercury's intelligence is combined with the energy and perseverance of Mars, creating ambitious and action-oriented individuals who perform best under pressure.\n\nRelationship: They are romantic and direct in their relationships, yet at times, their zeal causes conflict. They must learn to compromise in order to coexist peacefully.\n\nCareer Path: Administrative, banking, teaching, and the military is best for this combination. Their ability to think on their feet and make decisions quickly makes them an asset in situations that require high stress.\n\nChallenges: Impulsiveness and impatience will hold them back. Taking a more deliberate approach will serve them well in reaching their objectives.`,

    // 6-x
    '6-1': `Venus and Sun The Radiant Leader\n\nThis union combines the creative energy of Venus with the powerful will of the Sun and produces individuals with natural leadership potential. They are confident, ambitious, and charming, making them special in any crowd.\n\nRelationship: They are passionate and loving, but sometimes argue because they are both strong-willed. They want loyalty and peace in their relationship, but need to be less forceful to get along better.\n\nCareer Path: Law, politics, luxury brands, and high-end hotels are their best bets. They also excel in glamorous sectors of entertainment and media where they can exhibit their charm and leadership skills.\n\nChallenges: A tendency to take risks and become overly confident may result in a couple of setbacks. Developing humility and patience will help them achieve success ultimately.`,
    '6-2': `Venus and Moon The Compassionate Visionary\n\nThe blending of Venus and the Moon creates emotionally intelligent and caring human beings. This is a pleasant blend, prioritizing creativity, sympathy, and functionality.\n\nRelationships: They are considerate and empathetic partners who prioritize family and intimate relationships above all. Their increased sensitivity at times, though, causes them to be emotionally unstable.\n\nCareer Path: They do well in hospitality, art, and food enterprises, particularly those that involve a personal touch. Sweet enterprises, like bakeries or catering, suit them best.\n\nChallenges: They can suffer from indecisiveness and over-reliance on others for emotional support. Developing resilience and keeping their goals in mind can assist them in overcoming these issues.`,
    '6-3': `Venus and Jupiter The Conflicted Idealist\n\nThis match combines Venus's love of luxury with Jupiter's religious intelligence, and there is a conflict between material and ethical values. They tend to fight inside but can be very effective in their careers. \n\nRelationships: The relationship is not always smooth due to conflicting values. Venus desires beauty and harmony, but Jupiter craves discipline and higher ideals. It requires a balancing act.\n\nCareer Path: Ideal fields include law, finance, education, and consultancy, where they can combine their charm with intellectual pursuits.\n\nChallenges: Health issues and marital discord are common pitfalls. Cultivating self-discipline and aligning their goals with their values can lead to a more harmonious life.`,
    '6-4': `Venus and Rahu The Ambitious Innovator\n\nVenus and Rahu form a dynamic and enterprising pair, with the focus on luxury, innovation, and material prosperity. Rahu intensifies the need for recognition of Venus, so these individuals are strong risk-takers.\n\nRelationships: They tend to be passionate and intense in their relationships, tending to attract admirers who appreciate their ambition and charisma. Rahu's influence can cause instability in personal interactions.\n\nCareer Path: They achieve success in luxury sectors, entertainment, and high-profile business. Their innovative mind also leads them to entrepreneurial undertakings.\n\nChallenges: Their drive for success sometimes pushes them towards unethical accommodations. It is crucial to place them on the platform of ethics and provide emotional affinity over financial reward.`,
    '6-5': `Venus and Mercury The Balanced Diplomat\n\nThis is among the most harmonious matches, pairing the charm of Venus with the intelligence of Mercury. They are accommodating and versatile individuals who are fantastic communicators.\n\nRelationships: They are extremely loving and charismatic partners who treat each other with respect and consideration. Socially gifted, they are very popular and well-liked.\n\nCareer: Their professional domain would be in media, luxury travel, hospitality, and public relations as they will excel in careers that involve creativity and communication.\n\nChallenges: They can be guileless as well as indulgent to the point of excess when it comes to material life. They will need discipline and concentration as the key to long-term success.`,
    '6-6': `Double Venus The Artistic Powerhouse\n\nVenus in both the conductor and driver roles enhances the creative, charming, and love-for-luxury traits. These are born creative souls and visionaries.\n\nRelationships: They are very romantic and seek harmony in the relationship. At times, they tend to be slightly too good and hence disappointed.\n\nCareer: They must be into acting, modeling, music, or designing. They fare well in luxury business as well as in high-end retailing.\n\nChallenges: Lavishness of the idea of vanity or extravagance results in financial insecurity. Balancing the art of living is of the utmost importance.`,
    '6-7': `Venus and Ketu The Spiritual Artist\n\nThis mix bestows Venus creativity and spiritual depth from Ketu. These individuals are introspective and artistic with a proclivity to attempt balancing material success and inner happiness.\n\nRelationship: They are loyal and loving partners but are reluctant to show their emotions.\n\nCareer Path: They excel in research, arts, and sports because they perform well in roles that require analytical and creative minds.\n\nChallenges: Long-term recognition and lack of confidence may hamper their performance. Building confidence and keeping a clear notion of what they desire is essential.`,
    '6-8': `Venus and Saturn The Pragmatic Achiever\n\nVenus's draw combined with Saturn's practicality creates responsible and hard-working individuals. They are practical and ambitious individuals who can truly make things happen with a little persistence.\n\nRelationships: They are good and reliable partners who prize stability and commitment. They do have issues with the expression of emotions at times.\n\nCareer Path: They are particularly well-suited for professional areas such as law, real estate, or high-end industries. Their step-by-step working style also makes them effective in administrative roles.\n\nChallenges: Excessive effort and absence of personal self-care can lead to burnout. Self-regulation and integration of work and life needs to be prioritized`,
    '6-9': `Venus and Mars The Fiery Visionary\n\nThis blend brings Venus's luxury-love together with Mars's action-orientedness. Such a person born under this sign is goal-set, energetic, and ambitious.\n\nRelationship: Their relationships are passionate and sometimes explosive due to the Mars assertiveness. That implies they're required to practice patience and compromise.\n\nCareer Path: These are administrators in governments, luxury product manufacturers, and sportsmen. They put all this assertiveness and rapidity in decision-making to use.\n\nChallenges: Their impulsiveness, controversy, and scandals cause it to be hard for them to carry on smoothly. They require emotional balance and strategic thinking.`,

    // 7-x
    '7-1': `Ketu and Sun The Wise Leader\n\nIndividuals with Ketu placed alongside the power of the Sun have a great deal of sense of direction and leadership. Such individuals are usually revered for their wisdom and charm and are usually a good guide or teacher.\n\nRelationships: They are steady and stable partners, but at times their secretive nature creates the impression of being emotionally quite distant. They feel a deeper requirement for mental and spiritual communication rather than physical and material contact.\n\nCareer Path: Professions such as teaching, occult sciences, and leadership positions are appropriate for this mix. Their capacity to lead and inspire others makes them effective teachers or spiritual leaders.\n\nChallenges: They tend to over-think things and might not make a choice. The ability to balance the intellectual search with action is a success quotient.`,
    '7-2': `Ketu and Moon The Intuitive Thinker\n\nKetu and the Moon combination release the intuition of Ketu and the emotional depth of the Moon. They possess added intuition and creativity. The two planets are gentle; however, when together they introduce deep insight and empathy in relationships.\n\nRelationships: They are loving and sympathetic partners, usually giving emotional stability second place. However, this may result in mood changes or inferiority feelings.\n\nCareer Path: healing, occult, arts, where their sympathy and intuition will have the scope to excel. The ability to form profound bonds with people makes them fine counselors.\n\nChallenges: Emotional instability and over-sensitivity can be the stumbling blocks. Becoming emotionally resilient is the path forward.`,
    '7-3': `Ketu and Jupiter The Seeker of Knowledge\n\nBoth introspective Ketu and expansive Jupiter knowledge are combined in these individuals to give them a strong intellectual and spiritual foundation. They are born philosophers and are always drawn to teaching, healing, and higher truths.\n\nRelationships: While they do appreciate loyalty and mutual respect within a relationship, their high intellectual standards are sometimes a cause of difficulty in meeting suitable partners.\n\nCareer Path: Areas such as spiritual guidance, teaching, and healing are good. They excel in performing tasks that enable them to impart their knowledge and guide others.\n\nChallenges: They overanalyze and second-guess everything, which can cause them to take time in making decisions. This can be circumvented by learning to trust their intuition and then acting confidently.`,
    '7-4': `Ketu and Rahu The Balanced Strategist\n\nThis blend is the conjunction of Ketu's wisdom and Rahu's ambition, resulting in a balance of reflection and pragmatism. These people are strategic thinkers with the capacity to be very successful.\n\nRelationships: They are faithful yet guarded partners, tending to take their time to establish trust. Their down-to-earth attitude towards relationships guarantees lasting relationships.\n\nCareer Path: They are best in strategic positions, research, and administration. Their analytical mind and cautiousness make them a good problem solver.\n\nChallenges: Their cautious nature will at times lead them to miss opportunities. And gaining confidence and calculated risk-taking can help them do well.`,
    '7-5': `Ketu and Mercury The Analytical Genius\n\nThis is a balancing combination, in which the introspection of Ketu is combined with Mercury's intellect and versatility. Such people are analytical, keen-minded, and communicative.\n\nRelationships: Intellectually stimulating relationship is what they look for in their relationships. They look for partners who can understand their curiosity and wit. At times, they tend to have trouble with emotional openness.\n\nCareer Path: They would excel at data analysis, graphic design, marketing, or sales. Speed of thought and problem-solving is an invaluable skill in these professions.\n\nChallenges: Their overthinking nature may cause indecision or lost opportunities. They must reconcile their intellectual curiosity with action.`,
    '7-6': `Ketu and Venus The Spiritual Artist\n\nThis blend combines the spiritual richness of Ketu with the artistic and beauty-loving nature of Venus. They are reflective and creative, frequently working in jobs that let them be themselves.\n\nRelationships: They are tender and compassionate lovers who value emotional and mental attachment. Their reflective personalities may at times render them aloof.\n\nCareer Path: They excel in the areas of arts, athletics, and healing careers. They stand out in their professions with their innovative and intuitive style.\n\nChallenges: They tend to encounter delayed success and self-doubt. Building confidence and having faith in their own instincts assist them in reaching their full potential.`,
    '7-7': `Double Ketu The Challenged Seeker\n\nThis is a most difficult combination with Ketu both in driver and conductor positions. It points towards wisdom and higher spiritual development on one hand, but towards lack of direction or grounding on the other.\n\nRelationships: Such people usually experience issues in trust and emotional openness, which makes their relationships unstable.\n\nCareer Path: Occupations such as occult sciences, teaching, and spiritual healing suit them best because these professions enable them to utilize their introspection in fulfilling endeavors.\n\nChallenges: They can suffer from disappointment and setbacks in their personal relationships. Grounding in realistic goals and emotional resilience can counteract this.`,
    '7-8': `Ketu and Saturn The Patient Achiever\n\nThis blend combines introspective Ketu with disciplined Saturn and persistence. These individuals are persistent and systematic, able to attain enormous success with the passage of time.\n\nRelationships: They are loyal and dutiful partners who value stability and commitment. Yet, they can't be very open about their emotions.\n\nCareer Path: Teaching, research, and administrative professions are suitable for them. Their disciplined nature allows them steady advancement.\n\nChallenges: Frustration through delayed success and tendency to overwork. It is necessary to keep things in balance and take care of oneself.`,
    '7-9': `Ketu and Mars The Driven Visionary\n\nIt combines the wisdom of Ketu and the energy of Mars with ambition. Such a person is rather work-minded and tends to succeed sometimes easily by will power and energy.\n\nRelationships: It might be quite contentious on relationships because of assertiveness or enthusiasm. He learns patience and compromise.\n\nCareer path: Teaching, healing and occult are all the right paths in life because it's all about their spiritual interest as well as intellectual.`,

    // 8-x
    '8-1': `Saturn and the Sun\n\nThe combination of 8–1 indicates a conflict of Saturn with the Sun. Here, these two planets step into a battle; one symbolizes humility and karmic justice, and the other symbolizes ego and power. Therefore, a conflict between these two produces life full of strife and struggles.\n\nRelationship: Tense relationships are characteristic of this combination. The dominant natures of the two personalities tend to generate friction in personal relationships. Greater marital disharmony is also observed in women than in men, as Saturn's karmic influences them more. Harmonization requires much efforts on both sides of concerned people.\n\nCareer Path: While the 8–1 combination presents challenges, it also enables them to be tough and gain leadership traits. They excel where leadership and service converge, such as in governance, public administration, and social work. With practice to balance ambition with humility, they can become leaders.\n\nChallenges: The greatest challenge to this blend is balancing ambition and discipline. Professional delays and personal development are typical, and one must exercise patience and perseverance.`,
    '8-2': `Saturn and the Moon\n\nThe 8–2 blend brings Saturn's realistic, grounded approach together with the Moon's emotional, caring nature and produces a dynamic, yet opposing, personality that has difficulty balancing reason and feeling.\n\nRelationship: Individuals with this combination lack emotional vulnerability. They are shy and may not become vulnerable with their partners. Emotional stability is essential for healthy relationships because there will always be miscommunications and misunderstandings.\n\nCareer Path: Healthcare, counseling, and psychology careers are apt for this blend. Their ability to empathize, coupled with the controlling element of Saturn, makes them successful healers and caregivers. Nursing, social work, and humanitarian work are other apt areas.\n\nChallenges: Physical ailments, particularly stress-related ailments, are a common issue. Emotional stress further leads to indecisiveness that can impact their personal as well as professional life. Developing emotional strength is what would enable them to overcome these issues.`,
    '8-3': `Saturn and Jupiter\n\nSaturn and Jupiter combination (8–3) provides discipline together with wisdom to individuals, making them intellectual and moral. It makes individuals balanced with practical optimism. It therefore forms a very strong foundation for development.\n\nRelationship: The relationships are stable but the tension can build up in the relationship if such people are more concerned with professional advancement than with their personal lives. Jupiter's influence makes them friendly and softer than the sternness of Saturn.\n\nCareer Path: This combination excels in intellectual and formal working environments, such as practicing law, teaching school, or publishing. There are good prospects for healing arts and spiritual or religious professions. Their balance pursuing knowledge makes them a great teacher and instructor.\n\nChallenges: Saturn delays are frustrating, particularly when they begin a career. Yet, persistence with morality is rewarding in the long term. Rigidity or lack of flexibility has to be transcended.`,
    '8-4': `Saturn and Rahu\n\nThe 8–4 trinity brings together Saturn and Rahu, both of whom are linked with struggle and change. This strong combination tends to produce a life of karmic struggle and deep self-evolution.\n\nRelationship: This combination makes it hard to establish and sustain long-term relationships. Saturn's strictness and Rahu's spasmodic energy cause tensions and miscommunications. Unconventional or distant relationships might work better.\n\nCareer Path: Individuals with this combination excel in careers involving structure and change, such as engineering, mechanics, and building. They also excel in careers demanding strength and resilience, such as disaster management or rehabilitation.\n\nChallenges:Ongoing challenges and insecurity define this combination. Stability in personal and professional life is created through much effort and by actively problem-solving through adversity.`,
    '8-5': `Saturn and Mercury\n\nThe 8-5 blend of Saturn's discipline and Mercury's versatility combines a person who is strategic, analytical, and resourceful. This harmonious blend has added balance and concentration to these people.\n\nRelationship: In relationships, Mercury's talkativeness relieves Saturn's aloofness. Though they are responsible and loyal, they tend to overthink their feelings a bit, which at times creates misunderstandings between them.\n\nCareer Path: Real estate, banking, trade, and law combinations are ideal. They excel in well-planned jobs requiring cautious decisions and strategy thinking. Success usually arrives in leadership roles in controlled industries.\n\nChallenges: The biggest issue is stress control and over-thinking. Saturn brings success from hard work, yet tardy rewards or acknowledgment can be frustrating. Patience is needed to be learned.`,
    '8-6': `Saturn and Venus\n\nThe 8–6 pairing softens Saturn with Venus' charm and creativity, so the individual combines the best of practicality with beauty sense.\n\nRelationship: The relationships between partners are mostly peaceful because Venus has relaxed the sternness of Saturn. Nevertheless, there can be late marriages or misunderstandings of emotions. Stability and loyalty in a relationship are appreciated by these individuals.\n\nCareer Path: Artsy careers, such as media, fashion, and hospitality, are well suited for this combination. They are also very successful in careers that involve an organized approach to luxury and aesthetics, e.g., architecture or interior design.\n\nChallenges: Saturn's influence may slow down recognition in creative fields, putting them through a test of their patience and determination. Breaking free from self-doubt is the secret to unleashing their full potential.`,
    '8-7': `Saturn and Ketu\nThe Saturn (8)-Ketu (7) combination has extremely introspective and pious personalities who identify with mysticism and soul searching.\n\nRelationship: Emotional aloofness is a huge issue in relationships. With their shy nature and trust issues, intimate relationships might prove difficult for them. But once they connect with you, they are extremely loyal and supportive.\n\nCareer Path: Careers in astrology, yoga, teaching, and healing arts are most appropriate to this nature. They are also well suited for careers requiring intense analysis or giving spiritual advice.\n\nChallenges: Reverses and stagnation are the predominant themes of life. This person must balance introspection with socialization to be a success without becoming isolated in any chosen profession.`,
    '8-8': `Double Saturn\nWhen the driver and conductor numbers both are 8s, Saturn's energy is doubled. This combination translates into extremely difficult times but great potential for development.\n\nRelationship: Difficulty tends to be a word that defines relationships, particularly in regard to permanent attachments. Emotions tend to be locked tightly in one's chest, resulting at times in misunderstandings and disagreements.\n\nCareer Path: Physical labor occupations, engineering, or sports are a great fit for this combination. Achievement tends to come from determination and hard work, and Saturn repays those who stick it out.\n\nChallenges: People who have an 8–8 pairing face adversity and setbacks that mark their lives. That said, resilience and dedication can make challenges opportunities for growth and achievement.`,
    '8-9': `Saturn and Mars\n\nThe combination of Saturn's discipline and Mars's energy in the 8–9 energies creates ambitious, aggressive types. This is a very dynamic and forceful personality type.\n\nRelationship: The relationships tend to be abrasive since Mars's hot energy is countered by Saturn's earthy energy. Loyal respect, however, tends to produce long-term relationships.\n\nCareer Path: Careers in law enforcement, the military, or building are appropriate for this combination. Decision-making and disciplinary leadership roles are also suited.\n\nChallenges: There is a challenge in balancing Mars's impatience with Saturn's patience. Delays and arguments can occur, but their persistence guarantees ultimate success.\n\nChallenges: Impulsiveness and overpromising can be their worst enemies. Patience and long-term planning are what they need to develop.`,

    // 9-x
    '9-1': `Mars and the Sun\n\nThe 9-1 combination is a highly strong union of Mars (commander) and Sun (king). The two numbers can also lead, and thus, when paired together, can produce individuals who are ambitious and driven to achieve. This combination is also affected by the unpredictable energy of Mars, though, and thus becomes erratic at times.\n\nRelationship: This pair makes strong, but demanding relationships. Individuals here like to take charge in their personal lives, leading with passion and force. They are prone to be protective and faithful, yet their assertive nature could sometimes conflict with equally strong partners.\n\nCareer: The professions that fit for this combination are police work, military service, and administrative roles. Commanding roles where they can exercise control and command respect are suitable for their abilities.\n\nChallenges: Their greatest challenge is to manage their temper and impulsiveness. They must learn to balance their passionate energy with diplomacy to avoid conflicts at both personal and professional fronts.`,
    '9-2': `Mars and the Moon\n\n9–2 combination unites the assertiveness of Mars with the assertiveness and emotional nature of the Moon. This combination is responsible for the mixture of aggression and sensitivity, thereby producing a personality that is passionate and temperamental at the same time.\n\nRelationship: Relationships with this combination are usually problematic. Although they bring a depth of emotion to their relationships, the energies are so varied and at times are miscommunicated. Marriage is challenging, particularly emotional need coming up against the mate's need.\n\nCareer Path: This blend thrives in careers that involve empathy and doing - nursing, counseling, community service. They also function well within artistic pursuits where emotions play a large role in the communication.\n\nChallenges: The big challenge in combining Mars's assertiveness with sensitivity is mood-swinging. Successful attainment can be achieved with consistent behavior as opposed to mood swings.`,
    '9-3': `Mars and Jupiter\n\nMarrying the courage of Mars with the intelligence of Jupiter results in action-oriented, optimistic, and strategic individuals. The union is typically regarded as fortunate for personal growth and career advancement.\n\nRelationship: This combination in a relationship brings mutual respect and intellectual stimulation. They encourage each other as lovers of both intellectual and emotional connections. Their relationships are founded on common goals and a sense of purpose in life.\n\nCareer Path: The dream career is teaching, administrative, and in the military. Their courage combined with their sense of prudence makes them great leadership material for educational and public services.\n\nChallenges: Their greatest challenge is balancing the impulsiveness of Mars with the requirement of planning from Jupiter. They need to develop patience and strategy, in other words, in order to get the most out of things and reap long-term benefits.`,
    '9-4': `Mars and Rahu\n\n9–4 is not a simple combination since Mars and Rahu are linked with ego and intensity. Life is therefore filled with much conflict and struggling; much development of the individual may be required to get over these traits.\n\nRelationship: Relationships are dramatic and frequently fighting, due to ego and miscommunication. They usually have difficulty maintaining long-term relationships due to their unpredictability and intensity.\n\nCareer: Adventurous or hazardous careers, including defense, engineering, or entrepreneurial ventures. They will also excel in career or legal occupations.\n\nProblems: Health issues and accidents are common issues. Dominating control of their feral nature and ego will discourage wars and failure in life.`,
    '9-5': `Mars and Mercury\n\n9–5 pairing bestows Mars's energy with a tie-up with Mercury's adaptability and intelligence. The outcome is an enterprising, balanced person who can achieve success in most areas of life.\n\nRelationship: When it comes to relationships, the combination provides energy and equilibrium. They are lively and entertaining partners who appreciate communication and reciprocal understanding. At times, though, they can be impulsive in their interactions.\n\nCareer Path: Banking sector, media, and communications are the best fields for this combination. Their action-oriented and analytical nature helps them excel in careers that involve problem-solving and decision-making at a fast pace.\n\nChallenges: The primary challenge is to rein in their restlessness and remain focused on long-term goals. Patience and persistence are the solutions to long-term achievement.`,
    '9-6': `Mars and Venus\n\nThe 9–6 blend combines Mars's passion with Venus's creativity and charm. The blend is commonly effective but normally comes with controversy and personal problems.\n\nRelationship: The relationship is intense and unstable. Mars's aggressiveness clashes with Venus's desire for peace and luxury, creating quarrels. Marital peace becomes impossible without deliberate effort to settle disputes.\n\nCareer: Entertainment, media, and luxury sectors are appropriate areas for this combination. They would also do extremely well in professions that require charisma and boldness, like acting or public relations.\n\nWeaknesses: Relationship issues and controversies are extremely prevalent. Managing their impulsiveness and directing their energies towards positive activities can also help them thrive.`,
    '9-7': `Mars and Ketu\n\nThe combination of 9–7 brings the action-motivated strength of Mars together with the introspection and aloofness of Ketu. This generates spirituality, thoughtfulness, and courage. \n\nRelationship: There is emotional distance in the relationship. They are loyal and guarded but sometimes close-pretentious. They do well in relationships where they can discover personal space and freedom.\n\nCareer: Healing, teaching, and spiritual activities are well-adapted to this mix. They also excel at roles that involve courage and stamina, like social movements and disaster relief.\n\nChallenges: The greatest challenge is balancing their active and reflective nature. Transcending inaction and taking the leap can bring more achievement and satisfaction.`,
    '9-8': `Mars and Saturn\n\nThe Mars-Saturn combination provides a bold person with the discipline of Saturn. These individuals are determined, ambitious, and hardy in the face of adversity.\n\nRelationship: This combination makes for loyalty and commitment in a relationship. The opposing energies at times may spark power struggles. Respect and compromise are the ingredients for harmony.\n\nCareer Path: This mix is ideal for careers in law enforcement, the military, and engineering. They find themselves best suited to careers requiring discipline and bravery. They become top performers in their field in no time.\n\nChallenges: Delays and setbacks are natural since Saturn balances out the impulsiveness of Mars with a lesson in patience. Patience and planning are necessary to work through these challenges.`,
    '9-9': `Double Mars\n\nWhen both driver and conductor numbers are 9, Mars energy is intensified, making those who are extremely passionate and action-minded. But this combination also entails stability and balance issues.\n\nRelationship: People with strong personalities and independence tend to be explosive, as they fight easily. When committed, it is silently, and they seem to struggle with vulnerability.\n\nCareer Path: Roles involving activity physically or otherwise that brings some risk, leadership, or both are best for the combination. Entrepreneurship, defense, and sports are domains where they can put their energy into good use.\n\nChallenges: Their biggest challenge is controlling their intensity and not acting on impulse. Fostering patience and awareness can guide them in reaching their goals without unnecessary detours.`
  };

  function generatePersonalitySummary(driver, conductor, expression, soulUrge, personality) {
    let summary = `
      <h5>📝 Your Numerology Personality Report</h5>
      <p>Your <b>Driver Number</b> (${driver}) suggests: ${meanings[driver]}</p>
      <p>Your <b>Conductor Number</b> (${conductor}) reflects: ${meanings[conductor]}</p>
      <p>Your <b>Expression Number</b> (${expression}) reveals: ${meanings[expression]}</p>
      <p>Your <b>Soul Urge Number</b> (${soulUrge}) shows: ${meanings[soulUrge]}</p>
      <p>Your <b>Personality Number</b> (${personality}) indicates: ${meanings[personality]}</p>
      <hr>
    `;
    // Do NOT add the driver-conductor interpretation here to avoid duplicate output
    return summary;
  }

  // Lo Shu Grid calculation helpers (move these outside the event listener)
  function getLoShuGrid(dob) {
    const date = new Date(dob);
    const digits = [
      ...date.getDate().toString(),
      ...(date.getMonth() + 1).toString(),
      ...date.getFullYear().toString()
    ].filter(d => d !== '0').map(Number);
    const grid = {};
    for (let i = 1; i <= 9; i++) grid[i] = 0;
    digits.forEach(d => { if (d >= 1 && d <= 9) grid[d]++; });
    return grid;
  }
  function renderLoShuGrid(grid) {
    let html = `<h5>🔢 Lo Shu Grid</h5><table style="border-collapse:collapse;text-align:center;width:180px;">`;
    const order = [
      [4,9,2],
      [3,5,7],
      [8,1,6]
    ];
    for (let row of order) {
      html += '<tr>';
      for (let n of row) {
        html += `<td style="border:1px solid #bbb;padding:6px;width:40px;height:40px;font-size:1.2em;">${grid[n] ? n + (grid[n] > 1 ? `(${grid[n]})` : '') : ''}</td>`;
      }
      html += '</tr>';
    }
    html += '</table>';
    return html;
  }
  function renderLoShuAnalysis(grid) {
    const meanings = [
      '',
      'Career, leadership, planning',
      'Marriage, emotions, teamwork',
      'Health, education',
      'Wealth, hard work',
      'Strength, balance, communication',
      'Friends, helping nature, luxury',
      'Creativity, mental strength, children',
      'Memory, knowledge, wisdom',
      'Fame, energy, popularity'
    ];
    let html = '<h5>🧩 Lo Shu Grid Analysis</h5>';
    for (let i = 1; i <= 9; i++) {
      html += `<p><b>${i}:</b> ${grid[i] ? `${grid[i]}x – ${meanings[i]}` : 'Missing – Area to improve'}</p>`;
    }
    return html;
  }

  function analyzeLoShuPlanesAndYogs(grid) {
    // Define planes
    const planes = {
      mind: [4, 9, 2],
      emotional: [3, 5, 7],
      practical: [8, 1, 6],
      thought: [4, 3, 8],
      will: [9, 5, 1],
      action: [2, 7, 6],
      goldenYog: [4, 5, 6],
      silverYog: [2, 5, 8]
    };
    // Helper to check if all numbers in arr are present
    const allPresent = arr => arr.every(n => grid[n] > 0);
    // Helper to check if all numbers in arr are missing
    const allMissing = arr => arr.every(n => grid[n] === 0);

    let html = '<h5>🔎 Lo Shu Grid Planes & Yog Analysis</h5>';
    // Horizontal Planes
    html += `<p><b>Mind Plane (4,9,2):</b> ${planes.mind.map(n=>grid[n]>0?n:'<span style="color:red">X</span>').join('-')} `;
    if (allPresent(planes.mind)) html += '✅ Strong Mind Plane';
    else if (allMissing(planes.mind)) html += '❌ Weak Mind Plane';
    html += '</p>';
    html += `<p><b>Emotional/Spiritual Plane (3,5,7):</b> ${planes.emotional.map(n=>grid[n]>0?n:'<span style="color:red">X</span>').join('-')} `;
    if (allPresent(planes.emotional)) html += '✅ Strong Emotional/Spiritual Plane';
    else if (allMissing(planes.emotional)) html += '❌ Weak Emotional/Spiritual Plane';
    html += '</p>';
    html += `<p><b>Practical/Material Plane (8,1,6):</b> ${planes.practical.map(n=>grid[n]>0?n:'<span style="color:red">X</span>').join('-')} `;
    if (allPresent(planes.practical)) html += '✅ Strong Practical/Material Plane';
    else if (allMissing(planes.practical)) html += '❌ Weak Practical/Material Plane';
    html += '</p>';
    // Vertical Planes
    html += `<p><b>Thought Plane (4,3,8):</b> ${planes.thought.map(n=>grid[n]>0?n:'<span style="color:red">X</span>').join('-')} `;
    if (allPresent(planes.thought)) html += '✅ Strong Thought Plane';
    else if (allMissing(planes.thought)) html += '❌ Weak Thought Plane';
    html += '</p>';
    html += `<p><b>Will Plane (9,5,1):</b> ${planes.will.map(n=>grid[n]>0?n:'<span style="color:red">X</span>').join('-')} `;
    if (allPresent(planes.will)) html += '✅ Strong Will Plane';
    else if (allMissing(planes.will)) html += '❌ Weak Will Plane';
    html += '</p>';
    html += `<p><b>Action Plane (2,7,6):</b> ${planes.action.map(n=>grid[n]>0?n:'<span style="color:red">X</span>').join('-')} `;
    if (allPresent(planes.action)) html += '✅ Strong Action Plane';
    else if (allMissing(planes.action)) html += '❌ Weak Action Plane';
    html += '</p>';
    // Diagonal Planes (Yogs)
    html += `<p><b>Golden Yog (4,5,6):</b> ${planes.goldenYog.map(n=>grid[n]>0?n:'<span style="color:red">X</span>').join('-')} `;
    if (allPresent(planes.goldenYog)) html += '🌟 Golden Yog Present! (Fame, money, success)';
    else html += 'Golden Yog not present';
    html += '</p>';
    html += `<p><b>Silver Yog (2,5,8):</b> ${planes.silverYog.map(n=>grid[n]>0?n:'<span style="color:red">X</span>').join('-')} `;
    if (allPresent(planes.silverYog)) html += '🌟 Silver Yog Present! (Property, strength, challenges)';
    else html += 'Silver Yog not present';
    html += '</p>';
    return html;
  }

  // Kua number calculation (standard Feng Shui method)
  function getKuaNumber(dob, gender) {
    // dob: string (yyyy-mm-dd), gender: 'male' | 'female' | 'other'
    const date = new Date(dob);
    let year = date.getFullYear();
    let sum = year.toString().split('').reduce((a, b) => a + Number(b), 0);
    while (sum > 9) sum = sum.toString().split('').reduce((a, b) => a + Number(b), 0);
    let kua;
    if (gender === 'female') {
      kua = sum + 5;
      if (kua > 9) kua = kua.toString().split('').reduce((a, b) => a + Number(b), 0);
      if (kua === 5) kua = 8;
    } else { // male or other
      kua = 10 - sum;
      if (kua === 5) kua = 2;
      if (kua > 9) kua = kua.toString().split('').reduce((a, b) => a + Number(b), 0);
    }
    return kua;
  }

  // Enhanced Lo Shu Grid calculation: always fill driver, conductor, kua
  function getLoShuGridWithExtras(dob, driver, conductor, kua) {
    const date = new Date(dob);
    const digits = [
      ...date.getDate().toString(),
      ...(date.getMonth() + 1).toString(),
      ...date.getFullYear().toString()
    ].filter(d => d !== '0').map(Number);
    const grid = {};
    for (let i = 1; i <= 9; i++) grid[i] = 0;
    digits.forEach(d => { if (d >= 1 && d <= 9) grid[d]++; });
    // Always fill driver, conductor, kua numbers
    [driver, conductor, kua].forEach(num => {
      if (num >= 1 && num <= 9) grid[num] = Math.max(1, grid[num]);
    });
    return grid;
  }

  // --- Missing number meanings and remedies (user provided text) ---
  const missingNumberRemedies = {
    1: {
      icon: "🌞",
      meaning: "You may struggle with leadership, independence, or expressing yourself. It might be hard to start things on your own.",
      remedies: [
        "Place a fountain or aquarium in the North part of your home.",
        "Try to include number 1 in things like your house number, phone number, or car number.",
        "Pray to the Sun (Surya), and offer water to it in the morning.",
        "Worship the Surya Yantra for confidence and energy."
      ]
    },
    2: {
      icon: "🌙",
      meaning: "Difficulty in cooperating, being sensitive, or working well with others.",
      remedies: [
        "Share white-colored things like sugar, rice, milk, or white clothes.",
        "These items are connected to the Moon, which helps you become more kind, caring, and emotionally balanced.",
        "Donating also builds good karma and improves relationships."
      ]
    },
    3: {
      icon: "🎨",
      meaning: "Lack of creativity, fun, or communication. You may find it hard to express yourself or enjoy life.",
      remedies: [
        "Apply saffron (Kesar) tilak on your forehead daily.",
        "It helps bring clarity, joy, and emotional strength."
      ]
    },
    4: {
      icon: "🧱",
      meaning: "You may feel disorganized, unstable, or have trouble following routines.",
      remedies: [
        "Use earthy colors (brown, green, beige) in your home or office.",
        "These colors help you feel more grounded and stable."
      ]
    },
    5: {
      icon: "🔄",
      meaning: "Trouble with flexibility, change, or freedom. You may feel stuck or resist new ideas.",
      remedies: [
        'Chant the mantra "Om Budhaya Namaha" 108 times every morning.',
        'This connects you with the energy of Mercury, which brings better thinking and adaptability.'
      ]
    },
    6: {
      icon: "💖",
      meaning: "Difficulty in relationships, being caring, or taking responsibility. You may struggle with emotional connections.",
      remedies: [
        'Chant "Om Shukraya Namaha" 108 times daily.',
        'Wear white or pink clothes or decorate your space with these colors.',
        "Fast on Fridays (Venus's day) to improve love and harmony in life."
      ]
    },
    7: {
      icon: "🧘",
      meaning: "Lack of deep thinking, spirituality, or connection to inner truth.",
      remedies: [
        "Meditate daily for 15–30 minutes, focus on breathing or a calming word.",
        "Feed stray dogs with milk or bread to build good karma and spiritual energy."
      ]
    },
    8: {
      icon: "💼",
      meaning: "Problems with money, power, or achieving success. You may face struggles in building a stable life.",
      remedies: [
        'Chant "Om Sham Shanicharaya Namaha" 108 times daily.',
        "Fast on Saturdays to strengthen Saturn's positive influence.",
        'Stay disciplined and work hard—Saturn rewards effort.'
      ]
    },
    9: {
      icon: "🌍",
      meaning: "Lack of compassion, forgiveness, or helping others. You may find it hard to let go of the past.",
      remedies: [
        "Do volunteer work or help in causes like children, animals, or the environment.",
        "Supporting a cause helps open your heart and builds compassion."
      ]
    }
  };

  document.getElementById('numerologyForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const name = document.getElementById('name').value.toUpperCase().replace(/[^A-Z]/g, '');
    const nameResults = calculateChaldeanNameNumbers(name);

    const dobStr = document.getElementById('dob').value;
    const dob = new Date(dobStr);
    const day = dob.getDate();
    const month = dob.getMonth() + 1;
    const year = dob.getFullYear();

    // Get gender
    const gender = document.getElementById('gender').value;

    // Driver and Conductor
    const driver = reduceToSingleDigit(day);
    const yearSum = year.toString().split('').reduce((a, b) => a + Number(b), 0);
    const conductor = reduceToSingleDigit(day + month + yearSum);

    // Kua number
    const kua = getKuaNumber(dobStr, gender);

    const expression = nameResults.expression;
    const soulUrge = nameResults.soulUrge;
    const personality = nameResults.personality;
    const suggestion = colorZodiacSuggestions[driver];
    let suggestionHTML = '';
    if (suggestion) {
     suggestionHTML = `
      <p><strong>🎨 Lucky Color:</strong> ${suggestion.color}</p>
      <p><strong>♈ Personality Trait:</strong> ${suggestion.trait}</p>
     `;
    }

    // Calculate and render Lo Shu Grid (with driver, conductor, kua)
    const loShuGrid = getLoShuGridWithExtras(dobStr, driver, conductor, kua);
    const loShuGridHTML = renderLoShuGrid(loShuGrid);
    const loShuAnalysisHTML = renderLoShuAnalysis(loShuGrid);
    const loShuPlanesYogsHTML = analyzeLoShuPlanesAndYogs(loShuGrid);

    // --- Missing numbers and remedies output ---
    const missingNumbers = [];
    for (let i = 1; i <= 9; i++) {
      if (loShuGrid[i] === 0) missingNumbers.push(i);
    }
    let missingNumbersHTML = '';
    if (missingNumbers.length) {
      missingNumbersHTML = `<h5>❗ Missing Numbers: Impact & Remedies</h5>`;
      missingNumbers.forEach(n => {
        const data = missingNumberRemedies[n];
        if (data) {
          missingNumbersHTML += `
            <div style="margin-bottom:18px;">
              <b>${data.icon} Missing Number ${n}:</b>
              <div><i>What it means:</i> ${data.meaning}</div>
              <div><i>Remedies:</i>
                <ul>
                  ${data.remedies.map(r => `<li>${r}</li>`).join('')}
                </ul>
              </div>
            </div>
          `;
        }
      });
    } else {
      missingNumbersHTML = `<div style=\"color:green;font-weight:bold;\">🎉 Congratulations! You have no missing numbers in your Lo Shu grid.</div>`;
    }

    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = `
<p><strong>🔹 Driver Number:</strong> ${driver}<br> ${meanings[driver]}</p>
${getFullCompatibility(driver, "Driver Number")}

${suggestionHTML}

<p><strong>🔸 Conductor Number:</strong> ${conductor}<br>💬 ${meanings[conductor]}</p>
${getFullCompatibility(conductor, "Conductor Number")}

<p><strong>🧭 Kua Number:</strong> ${kua}</p>

<hr>
<p><strong>🗣️ Expression Number:</strong> ${expression}<br>💬 ${meanings[expression]}</p>
<p><strong>💖 Soul Urge Number:</strong> ${soulUrge}<br>💬 ${meanings[soulUrge]}</p>
<p><strong>😎 Personality Number:</strong> ${personality}<br>💬 ${meanings[personality]}</p>
<hr>
<p><strong>🧑 Gender:</strong> ${gender.charAt(0).toUpperCase() + gender.slice(1)}</p>
<p><strong>🌟 Gender Traits:</strong> ${genderTraits[gender] || ''}</p>
${loShuGridHTML}
${loShuAnalysisHTML}
${loShuPlanesYogsHTML}
${missingNumbersHTML}
<div id="personalitySummary">${generatePersonalitySummary(driver, conductor, expression, soulUrge, personality)}</div>
<div id="driverConductorInterpretation">${driverConductorInterpretations[`${driver}-${conductor}`] ? `<h5>🔎 Your Driver-Conductor Pair Interpretation</h5><div style='background:#f8f9fa;padding:12px;border-radius:8px;margin-bottom:10px;'>${driverConductorInterpretations[`${driver}-${conductor}`].replace(/\n/g, '<br>')}</div>` : ''}</div>
<div id="partnerComparison"></div>
`;
  });

  document.getElementById('partnerForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const partnerName = document.getElementById('partnerName').value.trim();
    const partnerGender = document.getElementById('partnerGender').value;
    const partnerDOBStr = document.getElementById('partnerDOB').value;
    if (!partnerName || !partnerGender || !partnerDOBStr) return;

    // User's grid (from last submission)
    const userDOBStr = document.getElementById('dob').value;
    const userDOB = new Date(userDOBStr);
    const userDay = userDOB.getDate();
    const userMonth = userDOB.getMonth() + 1;
    const userYear = userDOB.getFullYear();
    const userGender = document.getElementById('gender').value;
    const userDriver = reduceToSingleDigit(userDay);
    const userYearSum = userYear.toString().split('').reduce((a, b) => a + Number(b), 0);
    const userConductor = reduceToSingleDigit(userDay + userMonth + userYearSum);
    const userKua = getKuaNumber(userDOBStr, userGender);
    const userGrid = getLoShuGridWithExtras(userDOBStr, userDriver, userConductor, userKua);
    const userGridHTML = renderLoShuGrid(userGrid);
    const userAnalysisHTML = renderLoShuAnalysis(userGrid);
    const userPlanesYogsHTML = analyzeLoShuPlanesAndYogs(userGrid);
    const userGenderTrait = genderTraits[userGender] || '';

    // Partner's grid (with driver, conductor, kua)
    const partnerDOB = new Date(partnerDOBStr);
    const partnerDay = partnerDOB.getDate();
    const partnerMonth = partnerDOB.getMonth() + 1;
    const partnerYear = partnerDOB.getFullYear();
    const partnerDriver = reduceToSingleDigit(partnerDay);
    const partnerYearSum = partnerYear.toString().split('').reduce((a, b) => a + Number(b), 0);
    const partnerConductor = reduceToSingleDigit(partnerDay + partnerMonth + partnerYearSum);
    const partnerKua = getKuaNumber(partnerDOBStr, partnerGender);
    const partnerGrid = getLoShuGridWithExtras(partnerDOBStr, partnerDriver, partnerConductor, partnerKua);
    const partnerGridHTML = renderLoShuGrid(partnerGrid);
    const partnerAnalysisHTML = renderLoShuAnalysis(partnerGrid);
    const partnerPlanesYogsHTML = analyzeLoShuPlanesAndYogs(partnerGrid);
    const partnerGenderTrait = genderTraits[partnerGender] || '';

    // --- New: Compare missing/present numbers ---
    let userMissingPartnerHas = [];
    let partnerMissingUserHas = [];
    for (let i = 1; i <= 9; i++) {
      if (userGrid[i] === 0 && partnerGrid[i] > 0) userMissingPartnerHas.push(i);
      if (partnerGrid[i] === 0 && userGrid[i] > 0) partnerMissingUserHas.push(i);
    }

    // --- New: Partnership Lo Shu Grid (union of present numbers) ---
    const partnershipGrid = {};
    for (let i = 1; i <= 9; i++) {
      partnershipGrid[i] = Math.max(userGrid[i], partnerGrid[i]);
    }
    const partnershipGridHTML = renderLoShuGrid(partnershipGrid);
    const partnershipAnalysisHTML = renderLoShuAnalysis(partnershipGrid);
    const partnershipPlanesYogsHTML = analyzeLoShuPlanesAndYogs(partnershipGrid);

    // --- New: Partnership yog/plane highlights ---
    function getPartnershipHighlights(grid, userGrid, partnerGrid) {
      // Helper to check if a yog/plane is present in partnership but not in either individual
      const hasGolden = g => g[4]>0 && g[5]>0 && g[6]>0;
      const hasSilver = g => g[2]>0 && g[5]>0 && g[8]>0;
      const allPresent = arr => arr.every(n => grid[n] > 0);
      const allMissing = arr => arr.every(n => grid[n] === 0);
      const planes = {
        'Mind Plane': [4,9,2],
        'Emotional/Spiritual Plane': [3,5,7],
        'Practical/Material Plane': [8,1,6],
        'Thought Plane': [4,3,8],
        'Will Plane': [9,5,1],
        'Action Plane': [2,7,6]
      };
      let highlights = '';
      // Golden Yog
      if (hasGolden(grid) && (!hasGolden(userGrid) || !hasGolden(partnerGrid))) {
        highlights += `<div style='color:#b8860b;font-weight:bold;'>🌟 As a couple, you have the rare <b>Golden Yog</b> together (4,5,6)! This brings fame, money, and success to your partnership.</div>`;
      }
      // Silver Yog
      if (hasSilver(grid) && (!hasSilver(userGrid) || !hasSilver(partnerGrid))) {
        highlights += `<div style='color:#888;font-weight:bold;'>🥈 As a couple, you have <b>Silver Yog</b> (2,5,8)! This brings property, strength, and the ability to overcome challenges together.</div>`;
      }
      // Strong/weak planes
      for (const [plane, nums] of Object.entries(planes)) {
        if (allPresent(nums) && (!allPresent(nums.map(n=>userGrid[n])) || !allPresent(nums.map(n=>partnerGrid[n])))) {
          highlights += `<div style='color:#2e7d32;font-weight:bold;'>✅ Your partnership grid has a <b>strong ${plane}</b> (numbers ${nums.join(',')}) together, even if not present individually!</div>`;
        }
        if (allMissing(nums) && (!allMissing(nums.map(n=>userGrid[n])) || !allMissing(nums.map(n=>partnerGrid[n])))) {
          highlights += `<div style='color:#c62828;font-weight:bold;'>⚠️ Your partnership grid is <b>missing the ${plane}</b> (numbers ${nums.join(',')}) together. This may require extra effort as a couple.</div>`;
        }
      }
      return highlights;
    }
    const partnershipHighlights = getPartnershipHighlights(partnershipGrid, userGrid, partnerGrid);

    // --- New: Partnership compatibility verdict ---
    let partnershipVerdict = '';
    const totalPresent = Object.values(partnershipGrid).filter(v => v > 0).length;
    if (totalPresent === 9) {
      partnershipVerdict = '<span style="color:green;font-weight:bold;">🌟 Perfect Partnership! All numbers present together.</span>';
    } else if (totalPresent === 8) {
      partnershipVerdict = '<span style="color:#009688;font-weight:bold;">🏆 Legendary Synergy! Only one number missing—your partnership is nearly complete in every way.</span>';
    } else if (totalPresent === 7) {
      partnershipVerdict = '<span style="color:#1976d2;font-weight:bold;">💙 Excellent Partnership! You cover almost all numerological bases together.</span>';
    } else if (totalPresent === 6) {
      partnershipVerdict = '<span style="color:#388e3c;font-weight:bold;">👍 Good Partnership! You have many shared strengths, with a few areas to grow together.</span>';
    } else if (totalPresent === 4 || totalPresent === 5) {
      partnershipVerdict = '<span style="color:orange;font-weight:bold;">🙂 Somewhat Complementary Partnership. You have some strengths together, but also several missing areas.</span>';
    } else if (totalPresent <= 3) {
      partnershipVerdict = '<span style="color:red;font-weight:bold;">⚠️ Challenging Partnership. Many numbers are missing even together—extra effort and understanding will be needed.</span>';
    }

    // --- New: Details for missing/present numbers ---
    let compareDetails = '';
    compareDetails += `<p><b>Numbers you are missing but your partner has:</b> ${userMissingPartnerHas.length ? userMissingPartnerHas.join(', ') : 'None'}</p>`;
    compareDetails += `<p><b>Numbers your partner is missing but you have:</b> ${partnerMissingUserHas.length ? partnerMissingUserHas.join(', ') : 'None'}</p>`;

    // --- New: Detailed partnership interpretation ---
    let detailedPartnership = '';
    // Meanings for each number (already defined as 'meanings')
    // 1. Qualities partner brings to user
    if (userMissingPartnerHas.length) {
      detailedPartnership += `<p><b>Qualities your partner brings to you:</b></p><ul>`;
      userMissingPartnerHas.forEach(n => {
        detailedPartnership += `<li><b>${n}:</b> ${meanings[n]}</li>`;
      });
      detailedPartnership += `</ul>`;
    }
    // 2. Qualities you bring to your partner
    if (partnerMissingUserHas.length) {
      detailedPartnership += `<p><b>Qualities you bring to your partner:</b></p><ul>`;
      partnerMissingUserHas.forEach(n => {
        detailedPartnership += `<li><b>${n}:</b> ${meanings[n]}</li>`;
      });
      detailedPartnership += `</ul>`;
    }
    // 3. Shared weaknesses (numbers missing in both)
    let bothMissingNumbers = [];
    for (let i = 1; i <= 9; i++) {
      if (userGrid[i] === 0 && partnerGrid[i] === 0) bothMissingNumbers.push(i);
    }
    if (bothMissingNumbers.length) {
      detailedPartnership += `<p><b>Shared Weaknesses (both missing):</b></p><ul>`;
      bothMissingNumbers.forEach(n => {
        detailedPartnership += `<li><b>${n}:</b> ${meanings[n]}. <i>Consider working together to develop this area in your relationship.</i></li>`;
      });
      detailedPartnership += `</ul>`;
    }
    // 4. Partnership summary
    let partnershipSummary = '';
    if (totalPresent === 9) {
      partnershipSummary = 'You and your partner together form a complete and harmonious partnership, covering all aspects of life. This is a rare and powerful synergy!';
    } else if (bothMissingNumbers.length === 0 && (userMissingPartnerHas.length > 0 || partnerMissingUserHas.length > 0)) {
      partnershipSummary = 'You and your partner complement each other beautifully, each bringing unique strengths to the relationship.';
    } else if (bothMissingNumbers.length > 0) {
      partnershipSummary = 'While you and your partner cover many areas together, you both share some missing qualities. Awareness and teamwork can help you grow in these areas.';
    } else {
      partnershipSummary = 'Your partnership is balanced, with a mix of shared and complementary strengths.';
    }
    detailedPartnership += `<div class='mt-3'><b>Partnership Summary:</b> ${partnershipSummary}</div>`;

    // --- Output ---
    document.getElementById('partnerResult').innerHTML = `
      <div style="display:flex;gap:24px;flex-wrap:wrap;justify-content:center;">
        <div style="flex:1;min-width:260px;background:#f8f9fa;padding:12px;border-radius:8px;display:flex;flex-direction:column;align-items:center;">
          <h5>Your Lo Shu Grid</h5>
          <div style="text-align:center;">${userGridHTML}</div>
          ${userAnalysisHTML}
          ${userPlanesYogsHTML}
          <p><strong>🧑 Gender:</strong> ${userGender.charAt(0).toUpperCase() + userGender.slice(1)}</p>
          <p><strong>🌟 Gender Traits:</strong> ${userGenderTrait}</p>
        </div>
        <div style="flex:1;min-width:260px;background:#f8f9fa;padding:12px;border-radius:8px;display:flex;flex-direction:column;align-items:center;">
          <h5>Partner's Lo Shu Grid</h5>
          <div style="text-align:center;">${partnerGridHTML}</div>
          ${partnerAnalysisHTML}
          ${partnerPlanesYogsHTML}
          <p><strong>🧑 Gender:</strong> ${partnerGender.charAt(0).toUpperCase() + partnerGender.slice(1)}</p>
          <p><strong>🌟 Gender Traits:</strong> ${partnerGenderTrait}</p>
        </div>
      </div>
      <div class="card mt-4 mb-4 p-3" style="background:#eaf7ff;border-radius:14px;display:flex;flex-direction:column;align-items:center;">
        <h5>🤝 Partnership Lo Shu Grid (Combined)</h5>
        <div style="text-align:center;">${partnershipGridHTML}</div>
        ${partnershipHighlights}
        ${partnershipAnalysisHTML}
        ${partnershipPlanesYogsHTML}
        <div class="mt-2">${compareDetails}</div>
        <div class="mt-2"><b>Partnership Verdict:</b> ${partnershipVerdict}</div>
        <div class="mt-3">${detailedPartnership}</div>
      </div>
    `;
  });

  // After user calculation, show the compatibility prompt and hide partner section
  const numerologyForm = document.getElementById('numerologyForm');
  numerologyForm.addEventListener('submit', function(e) {
    // ...existing code...
    document.getElementById('compatibilityPrompt').style.display = 'block';
    document.getElementById('partnerSection').style.display = 'none';
    document.getElementById('partnerResult').innerHTML = '';
  });

  // Show partner section when prompt button is clicked
  const showPartnerSectionBtn = document.getElementById('showPartnerSection');
  if (showPartnerSectionBtn) {
    showPartnerSectionBtn.addEventListener('click', function() {
      document.getElementById('compatibilityPrompt').style.display = 'none';
      document.getElementById('partnerSection').style.display = 'block';
    });
  }